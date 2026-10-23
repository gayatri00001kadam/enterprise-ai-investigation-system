from pathlib import Path

from langchain_community.document_loaders import DirectoryLoader
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter


# Where our company documents are stored
DATA_PATH = Path("data")


# Load all Markdown files
loader = DirectoryLoader(
    str(DATA_PATH),
    glob="*.md",
    loader_cls=TextLoader
)

documents = loader.load()


# Split documents into smaller pieces
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

chunks = text_splitter.split_documents(documents)


print(f"Loaded documents: {len(documents)}")
print(f"Created chunks: {len(chunks)}")


# Display every chunk
for i, chunk in enumerate(chunks):
    print("\n------------------------------")
    print(f"CHUNK {i + 1}")
    print(f"SOURCE: {chunk.metadata.get('source')}")
    print(chunk.page_content)