import re
from typing import List, Dict, Any, Optional
from backend.core.finding import StaticFinding, CodeContext

class CodeContextExtractor:
    """
    Extracts relevant code context (function body, state variables, modifiers, external calls)
    for a given static finding to avoid sending the entire codebase to the LLM.
    """

    def extract(self, source_code: str, finding: StaticFinding) -> CodeContext:
        lines = source_code.splitlines()
        total_lines = len(lines)

        f_start = finding.line_start
        f_end = finding.line_end

        target_f_start = max(1, f_start - 30)
        found_func_header = False
        header_line_idx = -1
        func_name = finding.function

        for i in range(f_start - 1, target_f_start - 1, -1):
            if i < len(lines):
                line = lines[i]
                if re.search(r'\b(?:function\s+([a-zA-Z0-9_]+)|fallback|receive)', line):
                    header_line_idx = i
                    found_func_header = True
                    match = re.search(r'\bfunction\s+([a-zA-Z0-9_]+)', line)
                    if match:
                        func_name = match.group(1)
                    break

        if found_func_header:
            func_start_line = header_line_idx + 1
            func_end_line = self._find_closing_brace(lines, header_line_idx)
        else:
            func_start_line = max(1, finding.line_start - 5)
            func_end_line = min(total_lines, finding.line_end + 5)

        function_source = chr(10).join(lines[func_start_line - 1 : func_end_line])

        modifiers = []
        if found_func_header:
            header_str = lines[header_line_idx]
            mod_matches = re.findall(r'\b(onlyOwner|onlyAdmin|nonReentrant|initializer|payable|view|pure|internal|external|public|private|[a-zA-Z0-9_]+\([^)]*\))', header_str)
            modifiers = [m for m in mod_matches if m not in ['public', 'external', 'internal', 'private', 'view', 'pure', 'payable']]

        state_variables = self._extract_state_variables(lines, func_start_line)

        external_calls = []
        for line in lines[func_start_line - 1 : func_end_line]:
            clean = re.sub(r'//.*$', '', line).strip()
            if re.search(r'\.(call|transfer|send|delegatecall)\b', clean):
                external_calls.append(clean)

        surrounding_start = max(1, func_start_line - 5)
        surrounding_end = min(total_lines, func_end_line + 5)
        surrounding_code = chr(10).join(lines[surrounding_start - 1 : surrounding_end])

        return CodeContext(
            contract_name=finding.contract,
            function_name=func_name,
            function_source=function_source,
            line_start=func_start_line,
            line_end=func_end_line,
            modifiers=modifiers,
            state_variables=state_variables,
            external_calls=external_calls,
            surrounding_code=surrounding_code
        )

    def _extract_state_variables(self, lines: List[str], before_line_idx: int) -> List[str]:
        state_vars = []
        var_pattern = re.compile(r'\b(mapping\s*\([^)]+\)|address|uint\d*|int\d*|bool|bytes\d*|string)\s+(?:public|private|internal)?\s*([a-zA-Z0-9_]+)')
        for i in range(min(before_line_idx, len(lines))):
            line = lines[i].strip()
            if line.startswith('//') or line.startswith('/*') or 'function' in line or 'event' in line or 'struct' in line:
                continue
            match = var_pattern.search(line)
            if match and ';' in line:
                state_vars.append(line.rstrip(';'))
        return state_vars[:10]

    def _find_closing_brace(self, lines: List[str], start_idx: int) -> int:
        brace_count = 0
        found_first = False
        for idx in range(start_idx, len(lines)):
            line = lines[idx]
            clean_line = re.sub(r'//.*$', '', line)
            clean_line = re.sub(r'/\*.*?\*/', '', clean_line)
            for ch in clean_line:
                if ch == '{':
                    brace_count += 1
                    found_first = True
                elif ch == '}':
                    brace_count -= 1
                    if found_first and brace_count == 0:
                        return idx + 1
        return len(lines)

    def extract_candidates(self, source_code: str) -> List[Dict[str, Any]]:
        """Extract function slices that perform state updates, external calls, or are payable"""
        candidates = []
        lines = source_code.splitlines()
        
        in_contract = False
        contract_name = "Unknown"
        
        for i in range(len(lines)):
            line = lines[i]
            
            # Detect contract
            c_match = re.search(r'\bcontract\s+([a-zA-Z0-9_]+)', line)
            if c_match:
                contract_name = c_match.group(1)
                in_contract = True
            
            # Detect function
            if in_contract and re.search(r'\b(?:function\s+([a-zA-Z0-9_]*)|function\s*\(|constructor\s*\(|fallback\s*\(|receive\s*\()', line):
                f_name = "fallback"
                f_match = re.search(r'\b(?:function\s+([a-zA-Z0-9_]*)|function\s*\(|constructor\s*\(|fallback\s*\(|receive\s*\()', line)
                if f_match:
                    if f_match.group(1):
                        f_name = f_match.group(1)
                    elif 'constructor' in line:
                        f_name = 'constructor'
                    elif 'receive' in line:
                        f_name = 'receive'
                
                start_line = i + 1
                end_line = self._find_closing_brace(lines, i)
                func_lines = lines[i:end_line]
                
                is_candidate = False
                header = line
                
                # Condition 1: Payable
                if 'payable' in header:
                    is_candidate = True
                
                if not is_candidate:
                    for f_line in func_lines:
                        clean = re.sub(r'//.*$', '', f_line).strip()
                        # Condition 2: External call
                        if re.search(r'\.(call|transfer|send|delegatecall)\b', clean):
                            is_candidate = True
                            break
                        # Condition 3: State modification
                        if re.search(r'^(?!require|uint|int|address|bool|string|bytes)[a-zA-Z0-9_\[\]\.]+\s*(=|\+=|-=|\*=|/=)', clean):
                            if 'msg.value' not in clean: # Ignore msg.value additions typical of payable functions
                                is_candidate = True
                                break
                
                if is_candidate:
                    source_slice = chr(10).join(func_lines)
                    candidates.append({
                        "contract": contract_name,
                        "function_name": f_name,
                        "header": header,
                        "source": source_slice,
                        "line_start": start_line,
                        "line_end": end_line,
                        "state": chr(10).join(self._extract_state_variables(lines, start_line))
                    })
        
        return candidates
