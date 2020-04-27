# Setup

1. Clone this repo to a folder
2. Run `npm install` from the command line within your new project folder
3. Follow Figma's setup instructions (https://www.figma.com/plugin-docs/setup/)
4. In Figma, create a new plugin by going to your profile -> Plugins -> Create new plugin -> Generate from template (use "Run Once")
5. Save the new plugin somewhere
6. Copy manifest.json and figma.d.ts from the plugin into the root of your project folder (you can delete the rest of the plugin files)
7. Back in Figma, delete the plugin you just created and create a new one, this time using "Link existing plugin" and selecting the manifest.json in your project folder
8. Run `npm run dev`
9. Execute your plugin from Plugins -> Development -> ...

# Figma Documentation

-   Plugin info/guide: https://www.figma.com/plugin-docs/
-   Figma API documentation: https://www.figma.com/plugin-docs/api/api-overview/
