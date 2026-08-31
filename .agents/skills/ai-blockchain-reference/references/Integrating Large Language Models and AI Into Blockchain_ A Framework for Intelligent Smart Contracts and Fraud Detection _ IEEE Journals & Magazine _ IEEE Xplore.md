#### **Abstract:**

The convergence of Artificial Intelligence (AI) and Large Language Models (LLMs) with blockchain technology is transforming information systems by enhancing their efficiency, security, and decision-making capabilities. This research explores the integration of AI and LLMs, such as GPT and BERT, into blockchain-based information systems to address challenges related to data integrity, transaction processing, and smart contract automation. A layered architecture is proposed, comprising an AI-powered query engine, an LLM-enhanced decision-making layer, and a data synchronisation module bridging on-chain and off-chain environments. The system evaluation highlights significant improvements in transaction efficiency, query accuracy, energy savings, and detection rates of security threats. Experimental results demonstrate a 32% reduction in transaction latency, a 20.5% increase in fraud detection accuracy, and a 23% reduction in energy consumption. These findings underscore the viability of integrating AI and LLMs with blockchain technology for developing intelligent, secure, and scalable information systems.

![](_page_0_Diagram_4.jpeg)

The proposed framework presents an AI-driven blockchain decision-making system that seamlessly integrates query processing, LLM-based reasoning, blockchain execution, and... Show More

**Published in:** [IEEE Access](https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6287639) ( Volume: 13)

**Page(s):** 181323 - 181335

**Date of Publication:** 16 October 2025

**Electronic ISSN:** 2169-3536

**DOI:** [10.1109/ACCESS.2025.3622511](https://doi.org/10.1109/ACCESS.2025.3622511)

**Publisher:** IEEE

**Funding Agency:**

CCBY - IEEE is not the copyright holder of this material. Please follow the instructions via https://creativecommons.org/licenses/by/4.0/ to obtain full-text articles and stipulations in the API documentation.

# **SECTION I.** Introduction

Blockchain technology has emerged as a pivotal innovation in digital systems architecture, revolutionising the way data is recorded, verified, and shared across decentralised networks. Its core attributes—immutability, decentralisation, transparency, and security—have positioned it as a transformative force across multiple domains, including financial services, supply chain management, healthcare systems, e-governance, and digital identity verification. By replacing traditional intermediaries with cryptographic protocols and distributed ledgers, blockchain enables trustless interactions that are verifiable and tamper-resistant [\[1\].](javascript:void()) However, despite these strengths, blockchain systems still face significant challenges that limit their widespread adoption and optimal functionality. These limitations include high computational and energy costs, limited scalability, inefficient data retrieval, user interface complexities, and the manual, error-prone nature of smart contract development and auditing. To overcome these constraints, emerging technologies such as

Artificial Intelligence (AI) and Large Language Models (LLMs) offer compelling solutions [\[2\].](javascript:void()) AI has shown remarkable success in pattern recognition, anomaly detection, and predictive analytics, which are essential for strengthening the operational and security dimensions of decentralised systems. Meanwhile, LLMs—like OpenAI's Generative Pre-trained Transformer (GPT) and Google's Bidirectional Encoder Representations from Transformers (BERT)—have transformed the landscape of natural language processing by enabling machines to interpret, generate, and respond to human language with near-human fluency. These models are capable of understanding the context of queries, automating code generation, classifying text, and supporting complex decision-making tasks across structured and unstructured datasets. The convergence of blockchain with AI and LLMs forms the foundation of this research, which aims to build a more intelligent, scalable, and secure information system. This paper proposes a layered framework for integrating AI and LLMs into blockchain environments to address existing limitations and introduce intelligent automation into decentralised applications. The framework consists of three primary components, as shown in Fig. 1: [\(1\)](#page-4-0) an AI-powered query engine capable of translating user-input natural language queries into structured blockchain transactions, [\(2\)](#page-4-1) an LLM-enhanced decision-making layer responsible for smart contract generation, fraud detection, and anomaly identification, and [\(3\)](#page-4-2) a data synchronisation mechanism that bridges on-chain immutable records with off-chain dynamic datasets through cryptographic techniques like Merkle Trees.

Through this multi-layered architecture, the system offers both technical and non-technical users an intuitive interface for interacting with blockchain applications, while enhancing backend efficiency in transaction processing and data validation. The integration enables smart contract automation, maintains data consistency across hybrid environments, and supports real-time risk mitigation. It also promotes sustainability by reducing energy consumption through optimised consensus mechanisms such as Proof-of-Authority (PoA), which replaces energy-intensive mining with validator-based confirmations. Empirical results show notable performance gains: a 32% reduction in transaction latency, a 20.5% improvement in fraud detection accuracy using LLM classification, and a 23% decrease in energy use during processing. These outcomes confirm the technical viability and strategic advantage of integrating AI and LLMs with blockchain infrastructure, enhancing responsiveness, decision intelligence, and security—key enablers of wider blockchain adoption in enterprise and government domains.

This study's contributions extend beyond theoretical modelling by including a practical implementation that draws on real and synthetic datasets from Ethereum and Hyperledger Fabric networks. These datasets were used to train and evaluate the LLMs on smart contract auditing and fraud detection tasks. The system also leverages transfer learning and

**FIGURE 1.**

Flowchart illustrating the integration of AI and LLMs into blockchain technology.

![](_page_1_Diagram_3.jpeg)

supervised fine-tuning to adapt general-purpose language models to domain-specific blockchain functions. In addition, the use of annotated datasets with labelled fraud cases and optimised smart contract templates further enhanced the precision of the AI modules. The framework's adaptability allows it to be deployed in both public and permissioned blockchain environments, offering flexibility across regulatory and operational contexts. The research also introduces a formal mathematical model representing the system pipeline as a composition of query parsing, AI inference, synchronisation, and blockchain execution. This formalism provides a basis for future scalability and optimisation analysis, particularly in high-throughput environments such as decentralised finance (DeFi), where transaction speed and trust are paramount. The system's layered design enables modular deployment, meaning that each component—query engine, AI/LLM layer, synchronisation mechanism—can be improved or scaled independently as technology evolves. The broader implications of this integration are substantial. In sectors such as healthcare, AI-LLM-enhanced blockchain systems can be used for secure patient record management, personalised treatment recommendations, and anomalybased alerts in clinical workflows. In supply chains, smart contracts generated via LLMs can enforce compliance, automate logistics, and verify authenticity. In finance, intelligent fraud detection systems can help prevent unauthorised access, reduce double-spending incidents, and support regulatory reporting. Moreover, the use of conversational interfaces reduces the technical barrier for end-users, paving the way for mass adoption and digital inclusivity. The integration of AI and LLMs into blockchain systems represents a significant step toward the realisation of autonomous, context-aware, and scalable digital infrastructures. This research provides a holistic framework and empirical evidence supporting the viability of such systems. By combining natural language intelligence, machine learning-driven decisionmaking, and decentralised ledger technologies, this work lays a robust foundation for the next generation of intelligent blockchain applications and contributes to the evolving landscape of secure and efficient information systems.

## **SECTION II.**

# Related Work

The integration of Artificial Intelligence (AI) and Large Language Models (LLMs) with blockchain-based information systems has garnered increasing attention in recent years due to their potential to enhance security, scalability, data management, and decision-making processes. This literature review explores the current state of research and applications of AI and LLMs within blockchain systems, highlighting key advancements and identifying potential research gaps.

### **A. AI for Blockchain-Based Information Systems**

AI technologies have been widely adopted to optimise various functions within blockchain environments. According to [\[3\]](javascript:void()), AI can enhance the efficiency of consensus algorithms by predicting node behaviours and optimising resource allocation. Additionally, AI-powered analytics enable the detection of fraudulent activities and anomalies in blockchain networks, which is essential for maintaining data integrity and security. Machine learning (ML) models have been employed for predictive analytics and decision-making in decentralised finance (DeFi) and supply chain applications [\[4\]](javascript:void()). By analysing historical transaction data, ML algorithms can forecast trends, optimise smart contract operations, and improve user engagement strategies. AI-driven edge computing strategies have shown promise in overcoming the computational limitations of blockchain systems. As noted by [\[5\]](javascript:void()), federated learning approaches enable decentralised training of AI models, preserving data privacy while reducing the communication overhead typically associated with traditional centralised training methods.

## **B. LLMs and Blockchain Integration**

Large Language Models (LLMs), such as OpenAI's GPT series and similar models, offer capabilities that can transform the way information is managed and utilised within blockchain systems [\[6\]](javascript:void()). One key application area involves natural language processing (NLP) tasks for smart contract generation, auditing, and validation [\[7\].](javascript:void()) By leveraging LLMs, developers can generate more secure and efficient smart contracts while minimising human errors. LLMs facilitate the creation of intuitive user interfaces for blockchain applications, thereby lowering the barrier to entry for non-technical users [\[8\].](javascript:void()) NLP capabilities enable conversational interfaces that simplify complex blockchain interactions, enhancing user experience and adoption [\[9\]](javascript:void()). Another promising area of research involves the integration of LLMs for knowledge extraction and data management on blockchain networks. As blockchain systems generate massive amounts of data, LLMs can be used to summarise, index, and retrieve relevant information, thereby improving the scalability and usability of these systems [\[10\]](javascript:void()).

The convergence of AI, LLMs, and blockchain technology presents numerous synergistic benefits. The decentralised and tamper-proof nature of blockchain provides a secure foundation for training and deploying AI models, ensuring data integrity and traceability [\[11\],](javascript:void()) [\[12\]](javascript:void()). Conversely, AI and LLMs enhance blockchain scalability by optimising data storage and retrieval processes, reducing network congestion, and improving consensus mechanisms [\[13\].](javascript:void()) AI and LLMs also enable more intelligent and autonomous blockchain applications. For example, self-executing smart contracts can incorporate AI-driven decision-making logic, allowing for dynamic and adaptive responses to changing conditions within decentralised ecosystems [\[14\].](javascript:void()) AI-driven predictive models integrated with blockchain networks enhance decision-making processes in industries such as healthcare, finance, and logistics. By combining blockchain's secure data storage capabilities with AI's analytical prowess, organisations can create more robust and reliable systems [\[15\],](javascript:void()) [\[16\].](javascript:void()) For instance, healthcare providers can use these integrated systems for patient record management, ensuring data integrity while leveraging AI for disease prediction and personalised treatments.

## **D. Research Gaps and Future Directions**

Despite the numerous advancements, several challenges remain in the integration of AI and LLMs with blockchainbased information systems. One key issue is the computational and energy overhead associated with deploying AI models on resource-constrained blockchain nodes [\[17\]](javascript:void()). Developing lightweight and efficient AI models suitable for decentralised environments is a critical area for future research [\[18\].](javascript:void()) Additionally, ensuring the privacy and security of data used for AI training on blockchain networks remains a significant concern. Although federated learning approaches offer some solutions, further research is needed to address issues related to data leakage and model inversion attacks [\[19\].](javascript:void()) The ethical implications of AI-driven blockchain applications also warrant careful consideration. Transparent and accountable AI governance frameworks must be established to ensure fair and responsible use of these technologies in blockchain ecosystems [\[16\]](javascript:void()). Standardisation is another area where more research is needed. As blockchain and AI technologies evolve rapidly, a lack of interoperability and unified standards poses a significant barrier to their widespread adoption [\[20\].](javascript:void()) Research into cross-chain communication protocols and AI model compatibility can address these limitations and foster greater integration across systems. This research makes several key methodological and practical contributions focused on improving blockchain scalability, intelligence, and efficiency through AI and LLM integration: **Methodological Innovation:** A unified AI–LLM–Blockchain integration framework is developed, combining GPT-based smart contract generation and BERT-based fraud detection within a multi-layered blockchain architecture. The framework formalises a complete operational pipeline—from natural language query parsing to smart contract execution and fraud detection—ensuring seamless automation and enhanced decision-making.

**Algorithmic and Architectural Improvement:** The study introduces a two-stage validation algorithm (syntactic and semantic/security verification) for LLM-generated smart contracts. This method significantly improves contract reliability and prevents vulnerabilities such as reentrancy and integer overflow. The use of Proof-of-Authority (PoA) consensus further optimises transaction speed and sustainability by reducing computational overhead.

**Dataset-Driven Fine-Tuning:** The framework integrates real and synthetic datasets from Ethereum and Hyperledger Fabric networks and employs DAPPSCAN-SOURCE and DAPPSCAN-BYTECODE benchmarks to fine-tune LLMs. Transfer learning adapts general-purpose models to blockchain-specific contexts, thereby improving both the precision of fraud detection and the quality of smart contract generation.

**Quantifiable Performance Enhancement:** Empirical evaluation demonstrates measurable improvements:

32% reduction in transaction latency,

20.5% increase in fraud detection accuracy, and

23% reduction in energy consumption. These improvements validate the model's effectiveness in achieving intelligent automation and energy-efficient blockchain operations.

Scalability and Cross-Domain Relevance: The modular design supports deployment across public and permissioned blockchains, making it adaptable to diverse regulatory and operational environments such as finance, healthcare, and supply chains.

<span id="page-4-0"></span>View Source

where:

= Blockchain Layer:

= Transactions, = Smart Contracts, = Consensus Mechanism (e.g., PoA) T<sup>i</sup> SC<sup>j</sup> C<sup>k</sup>

= AI Layer with LLMs (GPT, BERT):

View Source

denotes the fraud probability score. F <sup>∈</sup> [0, 1] <sup>s</sup>

= Query Engine: Q

View Source

= Data Synchronization Layer: D

View Source

### **A. Performance Metrics**

View Source

**Explanation:**[Equation \(2\)](#page-4-1) represents the latency improvement. Here, denotes the system latency when using LLMs, while is the latency of conventional blockchain models. The factor indicates that the LLM-integrated system achieves a latency reduction of about 32% compared to traditional models. LLLM LTraditional δ<sup>L</sup> <sup>≈</sup> 0.32

<span id="page-4-2"></span><span id="page-4-1"></span>**Explanation:** [Equation \(3\)](#page-4-2) measures the energy efficiency. is the energy consumption of the proposed system, while corresponds to traditional approaches. The reduction factor shows that energy ELLM ETraditional δ<sup>E</sup> <sup>≈</sup> 0.23

S <sup>=</sup> f(B,A, Q, D) (1)

B {Ti, SC<sup>j</sup>

, Ck}

A

M<sup>1</sup> <sup>=</sup> GPT, M<sup>2</sup> <sup>=</sup> BERT

A <sup>=</sup> {M1(NLQ) <sup>→</sup> SC<sup>j</sup> , M2(Ti) <sup>→</sup> Fs}

Q : U −−→ Query( <sup>∨</sup> S ) NLP T<sup>i</sup> C<sup>j</sup>

D(x) <sup>=</sup> { x <sup>→</sup> Merkle Proof(x), x <sup>→</sup> Ledger, <sup>x</sup> <sup>∈</sup> Boff <sup>x</sup> <sup>∈</sup> Bon

LLLM <sup>=</sup> LTraditional <sup>⋅</sup> (1 <sup>−</sup> δL) (δ<sup>L</sup> <sup>≈</sup> 0.32) (2)

ELLM <sup>=</sup> ETraditional <sup>⋅</sup> (1 <sup>−</sup> δ<sup>E</sup> ) (δ<sup>E</sup> <sup>≈</sup> 0.23) (3)

<span id="page-5-0"></span>View Source

**Explanation:** [Equation \(4\)](#page-5-0) captures system accuracy improvement. is the baseline accuracy of standard models, while represents accuracy when LLMs are integrated. The improvement margin indicates a 15– 20% increase in accuracy, mainly due to the advanced natural language understanding and fraud detection capabilities of LLMs. AccTraditional AccLLM ΔAcc

View Source

<span id="page-5-1"></span>**Explanation:** [Equation \(5\)](#page-5-1) describes the enhancement in system security. is the security level provided by traditional blockchain-based systems, while incorporates the additional security gained from AI-powered anomaly detection and smart contract verification. The improvement factor ranges between 25–32%, showing a significant boost in fraud prevention and resilience against attacks. SecTraditional SecLLM ΔSec

AccLLM <sup>=</sup> AccTraditional <sup>+</sup> ΔAcc (ΔAcc <sup>≈</sup> 15% <sup>−</sup> 20%) (4)

SecLLM <sup>=</sup> SecTraditional <sup>+</sup> ΔSec (ΔSec <sup>≈</sup> 25% <sup>−</sup> 32%) (5)

## **SECTION IV.**

# Proposed Algorithm: AI-LLM Powered Blockchain Integration

Algorithm 1 presents the workflow of the proposed AI–LLM Enabled Secure and Scalable Blockchain System. The process begins with a natural language query provided by the user, which is parsed by the query engine using NLP techniques and then translated into a structured query. If the task is smart contract generation, GPT ( ) is employed to generate the contract code, which is subsequently validated against predefined rules before deployment onto the blockchain. For transaction analysis or validation tasks, the system retrieves the relevant transaction from the blockchain ledger and uses BERT ( ) to compute a fraud score. Transactions with scores exceeding the threshold are flagged as fraudulent, while the rest are accepted and logged. To ensure data integrity, both on-chain and off-chain data are synchronised using Merkle Proofs. Finally, the system employs a Proof-of-Authority consensus mechanism to optimise performance, and it outputs either the generated smart contract or the validated transaction with a complete audit trail. U M<sup>1</sup> M<sup>2</sup>

Algorithm 1. AI-LLM Enabled Secure and Scalable Blockchain System

**Require:** User query , Blockchain ledger , LLM models (GPT), (BERT) U B M<sup>1</sup> M<sup>2</sup>

**Ensure:** Validated transaction, Smart contract generation, and Fraud detection

1 **Input:** Natural language query from user 2 Parse using NLP in query engine 3 Translate to structured query 4 **if** task is **smart contract generation then** 5 Generate smart contract code 6 Validate using predefined rules U U Q U q SC<sup>j</sup> <sup>←</sup> M1(q) SC<sup>j</sup>

7 Deploy on blockchain via 8 **else if** task is **transaction analysis or validation then** 9 Fetch relevant transaction from 10 Compute fraud score 11 **if then** 12 Flag as Fraudulent 13 **else** 14 Accept and log to ledger 15 **end if** 16 **end if** 17 Synchronize on-chain and off-chain data using Merkle Proof 18 Optimise performance using Proof-of-Authority consensus mechanism 19 **return:** Smart contract or validated transaction with audit trail SC<sup>j</sup> B T<sup>i</sup> B F<sup>s</sup> <sup>←</sup> M2(Ti) F<sup>s</sup> ≥ θ T<sup>i</sup> T<sup>i</sup> Bon Boff

## **SECTION V.** Methodology

The proposed integration model leverages a layered architecture to combine AI and LLM capabilities with blockchain infrastructure. The architecture consists of three primary components: [\(1\)](#page-4-0) the data layer, which securely stores information on a distributed blockchain ledger; [\(2\)](#page-4-1) the AI processing layer, which houses trained LLM models for natural language processing tasks; and [\(3\)](#page-4-2) the smart contract layer, which facilitates automated operations and decisionmaking, as shown in Fig. 2. Data flows securely between these components, with blockchain ensuring data integrity and traceability. The AI models operate independently while accessing encrypted data on the blockchain, enabling real-time processing without compromising security.

## **A. Public Ledger Data from Ethereum and Hyperledger Fabric Networks**

Public ledgers from blockchain platforms such as Ethereum and Hyperledger Fabric provide transparent and immutable data for analysis. These datasets typically include details of transactions, smart contract deployments, and execution records.

#### **1) Ethereum**

A decentralised platform that supports smart contracts and is widely used in financial and decentralised application (dApp) systems [\[21\].](javascript:void()) Its public ledger provides transaction histories and contract interactions that can be leveraged to train AI models for fraud detection and transaction validation [\[23\].](javascript:void())

#### **2) Hyperledger Fabric**

A permissioned blockchain platform suitable for enterprise applications. The data obtained from Fabric includes confidential transactional records that help evaluate the performance of AI models in private blockchain settings [\[22\].](javascript:void())

### **B. Datasets for Smart Contract Auditing**

To ensure rigorous evaluation, we employed two benchmark datasets derived from real-world decentralised applications (DApps):

#### **1) Dappscan-Source**

Comprises 39,904 Solidity source files extracted from 682 real-world DApp projects. Incorporates 1,618 labelled SWC weaknesses, following the Smart Contract Weakness Classification Registry (SWC Registry).

#### **2) Dappscan-Bytecode**

Includes 6,665 compiled smart contracts (EVM bytecode). Annotated with 888 SWC weaknesses covering critical categories such as reentrancy, integer overflow, and access control flaws. Additionally, the dataset construction relied on 1,199 professional audit reports from 29 security teams, representing 44 person-months of auditing effort with contributions from 22 expert participants. This large-scale annotation process resulted in 9,154 identified weaknesses across contracts.

**FIGURE 2.**

System architecture of the proposed AI-LLM integrated blockchain framework, illustrating the data layer for secure storage, the AI/LLM processing layer for query handling and fraud detection, and the smart contract layer for automated decision-making and execution.

![](_page_7_Diagram_2.jpeg)

Both datasets were partitioned into training, validation, and test sets using a stratified split to preserve the natural distribution of SWC weaknesses: Training set: 70% ( ,400 Solidity files, 4,665 bytecode contracts) Validation set: 15% ( ,985 Solidity files, 1,000 bytecode contracts) Test set: 15% ( ,985 Solidity files, 1,000 bytecode contracts) This ensured balanced exposure of vulnerabilities while preventing data leakage between projects [\[28\]](javascript:void()). [https://github.com/InPlusLab/DAppSCAN.](https://github.com/InPlusLab/DAppSCAN) 32 ≈ 5 ≈ 5

## **C. Preprocessing Pipeline**

The preprocessing phase was designed to transform raw contract data into structured formats suitable for machine learning. For DAPPSCAN-SOURCE, Solidity source code was normalised by removing redundant comments, metadata, and pragma version conflicts to ensure consistency across different compiler versions. The cleaned contracts were then tokenised into Abstract Syntax Trees (ASTs), which allowed for structural analysis of program logic. Additionally, control-flow graphs (CFGs), opcode execution traces, and function signatures were extracted to capture both syntactic and semantic patterns of vulnerabilities. For DAPPSCAN-BYTECODE, the compiled contracts were first disassembled into normalised EVM instruction sequences, providing a low-level representation of contract behaviour. To further model contract interactions, contract call graphs were constructed, enabling the identification of cross-function and intercontract dependencies. Each bytecode segment was then aligned with its corresponding SWC vulnerability annotations, ensuring precise labelling of weaknesses. The labelling process followed the Smart Contract Weakness Classification Registry (SWC Registry), with vulnerabilities mapped to standard identifiers such as SWC-101 (Integer Overflow) and SWC-107 (Reentrancy). Since multiple weaknesses often co-existed within the same contract, a multi-label encoding scheme was employed to accurately capture this complexity. Finally, to address dataset imbalance, oversampling was applied to underrepresented SWC categories (e.g., SWC-136 Arbitrary Write). In addition, contract mutation techniques —such as renaming variables, altering constants, and reordering functions—were introduced as data augmentation strategies. These methods increased variability and improved the robustness of the models against adversarial or slightly modified contract inputs.

### **D. LLM Models and Training Setup**

Two state-of-the-art LLM architectures were fine-tuned to support blockchain-specific tasks. GPT (Generative Pretrained Transformer) was employed for smart contract generation and natural language query handling, leveraging its generative capabilities to transform user-defined requirements into executable contract code. In contrast, BERT (Bidirectional Encoder Representations from Transformers) was utilised for fraud and vulnerability detection within blockchain transactions and contracts, capitalising on its bidirectional attention mechanism for contextual understanding. Both models were trained under a standardised configuration that included a batch size of 32 and a learning rate of 2e-5, optimised using the AdamW optimiser with linear decay. The training process was carried out for a maximum of 10 epochs, with early stopping triggered after three consecutive non-improving epochs on the validation set. To accommodate the varying complexity of inputs, a maximum sequence length of 512 tokens was assigned for contracts, while 256 tokens were reserved for transaction data. The experiments were conducted on high-performance infrastructure, including an NVIDIA A100 GPU (40GB), 64GB of RAM, and 8 vCPUs, ensuring efficient large-scale training. Transfer learning techniques were applied to adapt the pre-trained GPT and BERT models to blockchainspecific domains, allowing the models to retain their general language understanding while specialising in vulnerability detection and contract generation. Smart contracts are being generated in the Solidity language using the Remix IDE network. This adaptation significantly improved both the accuracy and convergence speed of the models compared to training from scratch.

## **E. Baseline Algorithms**

All models were evaluated on the same processed dataset of blockchain transactions and smart contracts. The preprocessing included parsing contract bytecode to extract opcode sequences and opcode-frequency vectors, collecting transaction-level metadata such as gas usage and transfer values, and normalising continuous features. For text-based approaches, tokenisation was applied to contract code, while TF-IDF with vocabulary pruning (top 10,000 tokens) was used for the TF-IDF + LSTM baseline. Among the baseline algorithms, Random Forest (RF) demonstrated the highest accuracy due to its ability to capture non-linear relationships between features such as opcode frequency, gas usage, and transaction metadata. Its ensemble-based structure made it more resilient to noisy blockchain data compared to simpler linear models. In contrast, Support Vector Machine (SVM), while effective in small-scale binary classification, struggled with scalability when applied to large blockchain datasets containing thousands of features, and the use of kernel methods further increased computational overhead. Logistic Regression (LR) proved too simplistic, as it assumes linear decision boundaries, which is unrealistic for modelling diverse and complex vulnerabilities such as reentrancy and integer overflow. Similarly, traditional NLP approaches (TF-IDF combined with LSTM) were limited in effectiveness because TF-IDF fails to preserve semantic context and LSTMs suffer from vanishing gradient problems when processing long contract code sequences. Although RF emerged as the most accurate traditional model, it could not capture the

deeper contextual and semantic dependencies inherent in smart contracts. In contrast, LLMs such as GPT and BERT significantly outperformed all baselines, as their transformer-based architectures allowed them to model long-range dependencies and semantic structures, making them more suitable for tasks like smart contract generation and fraud detection. We used stratified 5-fold cross-validation to ensure robust performance estimates. For each fold, accuracy, precision, recall, F1-score, and AUC were computed. Reported metrics are the mean ± standard deviation across folds, and error bars are included in plots to show variance. Pairwise comparisons were tested for statistical significance using a paired t-test (or Wilcoxon test where applicable)

#### **F. Fraud Score Computation**

Fraud probability scores were generated by the BERT-based classifier for each transaction. To determine the decision rule, a thresholding mechanism was applied. The optimal cutoff value was identified through Receiver Operating Characteristic (ROC) analysis, which evaluates the trade-off between true positive and false positive rates. Based on this analysis, a threshold of was selected to balance precision and recall. Transactions with were classified as fraudulent, while those with were considered benign. This thresholding approach ensures minimal false alarms while maintaining reliable detection of fraudulent activity in blockchain transactions. (FS) (θ) θ <sup>=</sup> 0.65 F<sup>s</sup> ≥ 0.65 F<sup>s</sup> <sup>&</sup>lt; 0.65

### **G. Contract Validation Rules**

To ensure that LLM-generated contracts were both valid and secure, a two-stage validation pipeline was employed. In the first stage, syntactic validation was carried out using the Solidity compiler (solc) to verify structural correctness and ensure that the contracts could be successfully compiled. In the second stage, semantic and security validation was performed through rule-based analysis to detect common SWC vulnerabilities such as reentrancy, integer overflow, unauthorised access, and gas exhaustion. Automated auditing tools, including Mythril and OpenZeppelin libraries, were further utilised to strengthen the validation process. Only those contracts that successfully passed both validation stages were deployed on the Ethereum test network, guaranteeing a high level of reliability and security.

#### **H. Annotated Data for Training and Evaluating LLM Models in Fraud Detection and Smart Contract Generation**

Annotated datasets consist of labelled data that help LLMs (such as GPT and BERT) learn patterns for specific tasks.

#### **1) Fraud Detection**

Data includes flagged transactions indicating fraudulent activities like double spending or unauthorised withdrawals.

#### **2) Smart Contract Generation**

Labelled examples of secure and optimised smart contract code paired with corresponding natural language descriptions. These datasets are essential for supervised training, allowing LLMs to better understand the context and requirements for generating secure and efficient smart contracts and identifying anomalies.

## **I. AI Models**

In this research, two Large Language Model (LLM) architectures were employed to support blockchain-specific tasks: GPT (Generative Pre-trained Transformer) and BERT (Bidirectional Encoder Representations from Transformers). GPT, known for its generative capabilities, was fine-tuned to handle tasks such as natural language query processing and smart contract generation [\[26\].](javascript:void()) By leveraging its ability to generate coherent and contextually accurate text, GPT facilitated the creation of secure and optimised smart contracts from user requirements described in natural language. This approach simplified the smart contract development process, reducing the likelihood of human errors and improving overall efficiency. On the other hand, BERT was adapted for text classification tasks, including fraud detection and anomaly identification. Due to its bidirectional architecture, BERT excels at understanding the context of words within a sequence, making it particularly effective for identifying irregular patterns in blockchain transaction data. This capability proved essential for detecting fraudulent activities and ensuring the security of decentralised systems. The fine-tuning process for both models involved supervised learning using labelled datasets. Transfer learning techniques were applied to adapt the pre-trained models to blockchain-specific tasks. By using transfer learning, the models retained their general understanding of language while being optimised for the particular requirements of blockchain applications. This approach significantly enhanced the performance of the models in tasks related to smart contract generation, fraud detection, and anomaly classification within blockchain environments.

The blockchain environment for this research was configured to facilitate the integration of AI and LLM-based models with blockchain operations. Smart contract deployment was carried out using Solidity, a widely adopted programming language for creating secure and efficient smart contracts on the Ethereum platform. These contracts were deployed on an Ethereum test network, providing a safe and controlled environment for testing and validation [\[24\].](javascript:void()) To ensure scalable and efficient operations, the Proof-of-Authority (PoA) consensus mechanism was employed. Unlike Proof-of-Work (PoW), which requires extensive computational resources, PoA relies on a limited number of trusted nodes for transaction validation, making it faster and more energy-efficient. This choice enabled reliable blockchain operations while minimising energy consumption. The system was further configured with a distributed node setup running on virtual machines to simulate real-world conditions. This setup allowed for testing the performance and robustness of the blockchain environment under various scenarios, including high transaction loads and network latency challenges.

#### **K. Evaluation Metrics**

The performance of the integrated AI-Blockchain system was evaluated using several key metrics:

#### **1) Accuracy**

This metric measured the precision and recall of LLM-based tasks, such as smart contract validation and fraud detection. Higher accuracy indicated that the models were effective in generating secure contracts and correctly identifying fraudulent activities.

#### **2) Latency**

Response times for executing AI-enhanced smart contracts were monitored to evaluate the efficiency of the integrated system. Low latency was essential for ensuring smooth operations and real-time decision-making.

#### **3) Energy Consumption**

The computational energy usage of blockchain nodes and AI processes was tracked to assess the environmental impact of the system. Monitoring this metric provided insights into the efficiency of the PoA consensus and AI operations.

#### **4) Security**

The robustness of the system was tested against potential threats, including data breaches and unauthorised access. Ensuring a secure environment was critical for maintaining the integrity of blockchain transactions and AI-driven processes.

## **SECTION VI.**

# Proposed Framework

The proposed framework consists of interconnected components integrating AI and blockchain to support secure, efficient, and intelligent information systems. The visual representation typically depicts key modules such as the AIpowered query engine, LLM-enhanced decision-making layer, blockchain network, off-chain data storage, and data synchronisation mechanisms, as shown in Fig. 3.

Fig. 3 illustrates the architecture of an AI-LLM integrated blockchain framework that enhances secure and intelligent data management. The process begins with the user interface, where queries are submitted and passed through the AIpowered query engine for interpretation and refinement. These queries are then processed by the LLM-enhanced decision-making layer, which intelligently decides whether data should be managed on-chain through the blockchain network or off-chain in external storage. A data synchronisation module ensures consistency between both storage layers, maintaining real-time accuracy and integrity. The integrated system delivers three major outcomes: efficient transactions, AI-powered fraud detection, and optimised smart contracts. Overall, this architecture combines blockchain transparency with AI-driven decision-making to achieve scalability, security, and efficiency.

**FIGURE 3.**

AI-driven blockchain decision-making framework integrating query processing, LLM-based decision-making, blockchain execution, and off-chain data synchronisation.

## **SECTION VII.**

# AI-Powered Query Engine

The AI-powered query engine acts as the primary user interface for interacting with the blockchain system, bridging the gap between users and complex blockchain operations. It processes user queries and translates them into actionable requests for the blockchain. By utilising natural language processing (NLP) techniques, the engine comprehends user inputs, even when they are provided in everyday language rather than technical terms. It identifies the relevant data or operations required for tasks such as smart contract execution and transaction validation. Additionally, the query engine provides real-time responses by leveraging both blockchain data and AI-generated predictions, enhancing the system's responsiveness and efficiency. This functionality enables seamless interaction for non-technical users, fostering intelligent query handling and efficient data retrieval from blockchain networks.

The LLM-enhanced decision-making layer plays a crucial role in intelligent decision-making by analysing blockchain transactions and external data sources. It leverages fine-tuned Large Language Models (LLMs) such as GPT and BERT to generate insights from both structured and unstructured data, enabling more informed and context-aware operations

![](_page_11_Diagram_2.jpeg)

[\[25\]](javascript:void()). This layer supports the creation of optimised smart contracts by translating user requirements into efficient and secure code, streamlining the development process. Furthermore, it enhances security by assisting in fraud detection, analysing transaction patterns, and identifying anomalies that could indicate malicious activities. Additionally, it provides automated recommendations for governance and operational strategies in decentralised environments, contributing to better decision-making processes. Overall, this layer enhances the system's adaptability, operational efficiency, and intelligence.

## **B. Off-Chain and on-Chain Data Synchronisation**

Data synchronisation plays a vital role in ensuring seamless communication between the blockchain (on-chain) and external sources (off-chain). On-chain data includes immutable transaction records and smart contract states, while offchain data encompasses large datasets, sensor information, and other critical inputs for decision-making processes. A secure synchronisation mechanism is essential to maintain data consistency, ensure validation, and optimise storage efficiency while reducing computational overhead. By storing extensive data off-chain and keeping only critical records on-chain, the system achieves faster transaction processing and enhanced performance. The use of cryptographic proofs, such as Merkle trees, ensures data integrity and reliable synchronisation between the two environments. This synchronisation mechanism facilitates real-time data availability for AI-enhanced decision-making processes, enabling the proposed framework to harness the synergy of AI, LLMs, and blockchain for intelligent, efficient, and scalable applications.

## **SECTION VIII.**

# Results and Analysis

The proposed AI-LLM-powered blockchain framework was evaluated using Ethereum and Hyperledger transaction datasets along with the DAPPSCAN-SOURCE and DAPPSCAN-BYTECODE smart contract auditing datasets. Performance was benchmarked against baseline machine learning algorithms, including Random Forest (RF), Support Vector Machine (SVM), Logistic Regression (LR), and TF-IDF + LSTM. The evaluation focused on fraud detection accuracy, latency, energy consumption, and smart contract validation.

## **A. Training Process Evaluation of GPT and BERT**

The training and validation curves of GPT and BERT demonstrate stable convergence and strong generalisation across blockchain-specific tasks. For GPT, used in smart contract generation, training accuracy improved from 70% to 98% within ten epochs, while validation accuracy closely followed at 97%, with loss steadily decreasing from 1.2 to 0.25 as shown in Fig. 4. This indicates that GPT effectively learned to translate natural language requirements into executable and secure smart contracts without overfitting. Similarly, BERT, applied to fraud detection, achieved a training accuracy of 97% and validation accuracy of 96%, with corresponding losses declining from 1.1 to 0.22 and 1.2 to 0.25. The close alignment between training and validation curves confirms the robustness of the models and the efficiency of optimisation using AdamW as shown in Fig. 5. Unlike traditional baselines such as Random Forest or SVM, which fail to capture deep semantic dependencies, these transformer-based architectures exhibited superior contextual learning, enabling higher precision in fraud detection and vulnerability identification. Overall, the training process validates that GPT and BERT are well-suited for blockchain environments, achieving faster convergence, reduced errors, and significant improvements over conventional approaches.

## **B. Fraud Detection Performance**

The BERT-based fraud detection model significantly outperformed all baseline algorithms. While Random Forest demonstrated the strongest performance among traditional models, it could not effectively capture the semantic and contextual dependencies within blockchain transactions. BERT achieved a fraud detection accuracy of 94.3%, compared to 73.1% for RF, as shown in Fig. 6 and Table 1.

**FIGURE 4.**

Training curves of the GPT model for smart contract generation. The accuracy steadily improves while the loss decreases, demonstrating stable convergence and generalisation ability.

![](_page_13_Figure_2.jpeg)

**FIGURE 5.**

Training process of the BERT model for fraud detection, showing accuracy improvement up to 96% and stable loss convergence across 10 epochs.

![](_page_13_Figure_5.jpeg)

**TABLE 1** Fraud Detection Performance Comparison

## **C. Latency and Transaction Efficiency**

Transaction latency was measured under the Ethereum test network using Proof-of-Authority (PoA). The proposed AI-LLM integrated framework reduced average transaction latency by 32%, achieving smoother and more efficient execution as shown in Fig. 7 and Table 2.

**FIGURE 6.**

Fraud detection performance comparison showing that the proposed BERT-based model outperforms traditional baselines across all metrics.

![](_page_14_Figure_2.jpeg)

**TABLE 2** Transaction Latency Comparison Between Traditional and AI-LLM Systems

![](_page_14_Figure_9.jpeg)

#### **D. Energy Consumption**

By employing PoA consensus and optimised AI processing, the proposed system reduced energy consumption by 23% compared to traditional Proof-of-Work execution, as shown in Fig. 8 and Table 3.

**TABLE 3** Energy Consumption Comparison Between Traditional and AI-LLM Systems

**FIGURE 8.**

Energy consumption comparison showing a 23% reduction achieved by the AI-LLM integrated system over the traditional blockchain model.

![](_page_15_Figure_10.jpeg)

## **SECTION IX.**

# Discussion

The integration of AI and LLMs into blockchain systems has shown notable gains in efficiency, fraud detection, and energy savings. However, several limitations remain. The high computational cost of fine-tuning GPT/BERT makes adoption challenging for smaller organisations. Deploying LLMs on resource-constrained blockchain nodes also raises scalability concerns under heavy loads. In addition, the framework is vulnerable to adversarial inputs, such as malicious contracts or poisoned data, which may reduce security. Its validation on Ethereum and Hyperledger limits generalisation to dynamic cross-chain environments, while regulatory and ethical concerns such as accountability and data privacy also

#### ALSO ON IEEE XPLORE

| 9 months ago 1 comment      |                        |
|-----------------------------|------------------------|
| Auditing an Internet voting |                        |
| (i-voting) system can be    |                        |
| viewed as a specialised     |                        |
| Beyond the Happy Path:      |                        |
| a year ago 1 comment        |                        |
| This paper proposes a novel |                        |
| coupled unilateral          |                        |
| teleoperation system that   |                        |
| A Coupled Unilateral        |                        |
| 4 months ago 2 comments     |                        |
| Customer churn prediction   |                        |
| is essential across data   |                        |
| driven industries such as   |                        |
| Customer Churn              |                        |
| Prediction on               |                        |
| 6 months                    | ago 1 comment          |
| Healthcare                  | industry faces         |
| significant                 | challenges due to      |
| fraudulent                  | medical                |
| SLM with                    | Swarm                  |
| Intelligence                | for                    |
|                             | 5 months ago 1 comment |
|                             | The evaluation of      |
|                             | microscopic human      |
|                             | blastocyst images is   |
|                             | NMT-UNet: Neural       |
|                             | Architecture Search    |

persist. To overcome these challenges, future research should focus on lightweight LLMs (e.g., distilled or quantised models) for cost-effective deployment. Federated learning approaches can enable decentralised, privacy-preserving training. Adaptive security mechanisms with anomaly detection and explainable AI are needed to improve adversarial robustness. Extending the framework to cross-chain and interoperable systems will expand its applicability. Furthermore, building domain-specific LLMs (e.g., Solidity-aware models) can enhance smart contract auditing. Finally, sustainability-oriented AI models will be essential to minimise energy consumption while maintaining high accuracy.

## **SECTION X.**

# Conclusion

This research presented a novel framework for integrating Artificial Intelligence (AI) and Large Language Models (LLMs) with blockchain-based information systems to enhance performance, security, and scalability. By employing GPT for natural language-based smart contract generation and BERT for fraud detection, the proposed system demonstrated significant improvements in multiple dimensions. The integration of an AI-powered query engine, an LLM-enhanced decision-making layer, and an efficient on-chain/off-chain data synchronisation mechanism led to improved transaction efficiency and user experience. Experimental evaluations showed a substantial reduction in transaction latency (up to 36%), increased fraud detection accuracy (up to 31.4%), and a 23% decrease in energy consumption. Additionally, the system enhanced anomaly detection capabilities, making it robust against security threats. The proposed framework illustrates the transformative potential of combining cutting-edge AI technologies with decentralised blockchain platforms. These findings offer a strong foundation for building intelligent, secure, and scalable information systems, paving the way for broader adoption of AI-driven blockchain applications in critical sectors such as finance, healthcare, and supply chains.