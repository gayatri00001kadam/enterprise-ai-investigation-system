from pathlib import Path

from langchain_community.document_loaders import DirectoryLoader
from langchain_community.document_loaders import TextLoader


# Our company documents are stored inside the data folder
DATA_PATH = Path("data")


# Load all Markdown (.md) files from the data folder
loader = DirectoryLoader(
    str(DATA_PATH),
    glob="*.md",
    loader_cls=TextLoader
)


# Read the documents
documents = loader.load()


# Show how many documents were loaded
print(f"Loaded {len(documents)} documents")


# Show information about every document
for document in documents:
    print("\n------------------------------")
    print("SOURCE:", document.metadata.get("source"))
    print("CONTENT:")
    print(document.page_content)