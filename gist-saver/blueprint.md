# **App Name**: GistSaver

GistSave is a Chrome extension that allows users to save selected text from webpages to their GitHub Gists.

## Core Features

- Auth Token Configuration: Display an options page upon initial installation, prompting the user to configure their GitHub Auth Token.
- Context Menu Integration: Add a 'Save to Gist' option to the context menu (right-click menu) when the user selects text on a webpage.
- Gist Name Input: Display a non-modal floating layer prompting the user to input a name for the Gist upon selecting 'Save to Gist'.
- Gist Creation and Feedback: Save the selected text to a new Github Gist using the provided Auth Token and Gist name, displaying a loading state during the process, and showing the Gist link or an error message upon completion.

## Style Guidelines

- Primary color: Dark gray (#333) for the main background and text.
- Secondary color: Light gray (#f0f0f0) for input fields and subtle backgrounds.
- Accent: Teal (#008080) for the 'Save' button and links to Gists.
- Use a clean and simple layout for the options page and floating layer, focusing on ease of use.
- Use simple and recognizable icons for loading, success, and error states.
- Use a subtle loading animation during the Gist creation process.