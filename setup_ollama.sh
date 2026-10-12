#!/bin/bash
# Setup script for Ollama with Intel iGPU support
# Runs Ollama natively (not in Docker) to leverage /dev/dri for Intel Iris Xe

set -e

echo "=== Smart Contract Scanner - Ollama Setup ==="

# 1. Check Intel GPU
if [ -e /dev/dri/renderD128 ]; then
    echo "✅ Intel GPU detected at /dev/dri/renderD128"
else
    echo "⚠️  No Intel GPU found at /dev/dri/renderD128 - will use CPU inference"
fi

# 2. Install Ollama if not present
if command -v ollama &> /dev/null; then
    echo "✅ Ollama already installed: $(ollama --version)"
else
    echo "📦 Installing Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
    echo "✅ Ollama installed: $(ollama --version)"
fi

# 3. Start Ollama server (if not running)
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama server already running"
else
    echo "🚀 Starting Ollama server..."
    ollama serve &
    sleep 5
    echo "✅ Ollama server started"
fi

# 4. Pull the 1.5B model
MODEL="qwen2.5-coder:1.5b"
echo "📥 Pulling model: $MODEL"
ollama pull $MODEL

# 5. Verify model works
echo "🧪 Testing model inference..."
RESPONSE=$(curl -s -X POST http://localhost:11434/api/generate \
    -d "{\"model\":\"$MODEL\",\"prompt\":\"Say hello in one word\",\"stream\":false}" \
    | python3 -c "import sys,json; print(json.load(sys.stdin).get('response','FAILED')[:50])" 2>/dev/null)

if [ "$RESPONSE" != "FAILED" ] && [ -n "$RESPONSE" ]; then
    echo "✅ Model inference working: $RESPONSE"
else
    echo "❌ Model inference failed"
    exit 1
fi

# 6. Check GPU utilization
echo ""
echo "=== GPU Info ==="
if command -v intel_gpu_top &> /dev/null; then
    echo "Intel GPU monitoring available via intel_gpu_top"
fi
lspci | grep -i vga || true

echo ""
echo "=== Setup Complete ==="
echo "Ollama running at http://localhost:11434"
echo "Model: $MODEL"
echo "Backend should use OLLAMA_URL=http://localhost:11434"
