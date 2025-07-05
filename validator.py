from google import genai
from google.genai import types
import json
import re

class Validator:
    def __init__(self):
        open_key = self._load_key('./keys.json')
        self.key = open_key
        self.client = genai.Client(api_key=open_key)
        self.system1 = """
        You are part of an access to information system that is intended to make sure people get access to credible
        information. Users want to check the credibility of claims, stories or rumors through you and your responsibility
        is to do fact-checking on the claims. You are required to do a google search to get results relavant to the claim
        and then generate a fact-check validity report. The report contains 3 things: 1. summary of sources reporting on
        the claim if any, 2. credibility summary on the 3 most credible and 3 least credible of the sources if any and 3.
        A conclusion considering all the 2 things above.

        Here is the user's claim/question/story/story:
        """

        self.system = """
        You are a fact-checking system required to verify the credibility of claims, stories, rumors or news provided by a user
        and measure bias where possible. You are required to generate a credibility report which is easy to understand as short
        as possible after you do a google search. A credibility report includes 1. a cridibility score which is out of 10, 
        2. A summary of the credibility of the claim, story or news and 3. A brief source analysis of the top 5 sources you used to
        determine the credibility(also include bias for every source). Always try to use the most credible sources in making a
        determination and explain details that need explaining.

        Your response should be in JSON Format and should follow the following structure:
        {'result':[...array of headings/paragraphs]}
        The content is going to be dynamically rendered hence the element of the array should have the structure-
        {'type':element type, 'content':content} where there are two element type 'heading' for a heading and 'para' for a
        paragraph. The content is what will be displayed. The elements should be put in the oderer described above starting with the
        credibility score which should be a heading e.g 'Credibility Score: 5', A summary which should start with a heading and source
        analysis which should start with a heading too.
        """

    def _load_key(self, key_path):
        with open(key_path, 'r') as f:
            keys = json.load(f)
            return keys.get("google") # Assuming your key is stored under "api_key"

    def search(self, claim):
        grounding_tool = types.Tool(google_search=types.GoogleSearch())
        config = types.GenerateContentConfig(tools=[grounding_tool])
        response = self.client.models.generate_content(model="gemini-2.5-flash", contents=self.system + claim, config=config)
        out=response.text
        out = re.sub(r'^(```)?json\s*', '', out.strip(), flags=re.IGNORECASE)
        out = re.sub(r'```$', '', out.strip())
        out = out.replace("“", '"').replace("”", '"').replace("‘", "'").replace("’", "'")
        return out