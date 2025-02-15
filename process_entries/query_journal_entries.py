
import pandas as pd
import anthropic
import os
from typing import List, Dict
import instructor
from pydantic import BaseModel
from tqdm import tqdm


class RelevantDates(BaseModel):
    relevant_dates: List[str]
    reasoning: str

def get_relevant_entries(query: str, entries_df: pd.DataFrame) -> List[Dict]:
    """
    Determine which journal entries are relevant to the user's query
    """
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    client = instructor.from_anthropic(client)  # Enable instructor for Anthropic
    
    # Combine all entries into one text
    entries_text = "\n\n".join([
        f"Entry from {row['date']}:\n{row['entry']}" 
        for _, row in entries_df.iterrows()
    ])
    
    prompt = f"""Given the query: "{query}"
    
    Review these journal entries and identify which dates contain relevant information.
    
    {entries_text}
    
    Return the dates of entries that are relevant to answering this query."""
    
    response = client.messages.create(
        model="claude-3-5-haiku-20241022",
        max_tokens=1024,
        temperature=0,
        messages=[{"role": "user", "content": prompt}],
        response_model=RelevantDates
    )
    
    # Filter entries based on relevant dates
    return [
        {"date": row['date'], "entry": row['entry']}
        for _, row in entries_df.iterrows()
        if str(row['date']) in response.relevant_dates
    ]
    
def answer_query(query: str, relevant_entries: List[Dict]) -> str:
    """
    Use Claude to answer the query based on relevant journal entries
    """
    if not relevant_entries:
        return "No relevant journal entries found to answer this query."
        
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    # Construct context from relevant entries
    context = "\n\n".join([f"Entry from {entry['date']}:\n{entry['entry']}" 
                          for entry in relevant_entries])
    
    prompt = f"""Based on the following journal entries,
    and keeping in mind that more recent entries are more relevant to the user's current situation, please answer this query: "{query}"

    Relevant journal entries:
    {context}
    
    Please provide a thorough answer that synthesizes information from the relevant entries. Respond to the user in the second person, as 
    the person querying is the one who wrote the diary entries. Try to be kind, but most importantly be completely honest."""
    
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2048,
        temperature=0.7,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return message.content

def process_query(query: str) -> str:
    """
    Main function to process a query against journal entries
    """
    # Read journal entries
    try:
        print("Processing CSV as pandas.")
        entries_df = pd.read_csv('fake-journal-entries.csv')
        print("Finished processing CSV as pandas.")
    except FileNotFoundError:
        return "Error: Journal entries file not found."
        
    # Get relevant entries
    print("Getting relevant entries")
    relevant_entries = get_relevant_entries(query, entries_df)
    print([entry["date"] for entry in relevant_entries])
    
    # Get answer from Claude
    answer = answer_query(query, relevant_entries)
    
    return answer

if __name__ == "__main__":
    query = input("Input your query here: ")
    result = process_query(query)
    print("\nAnswer:", result)
