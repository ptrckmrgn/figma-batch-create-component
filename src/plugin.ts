const init = () => {
    let components: ComponentNode[] = [];
    const selection = figma.currentPage.selection;

    if (selection.length > 0) {
        for (const node of selection) {
            if (node.type !== "SLICE" && node.type !== "COMPONENT") {
                const parent = node.parent;
                let component;

                if (node.type === "FRAME") {
                    component = createComponentFromFrame(node);
                } else {
                    component = figma.createComponent();
                    component.resizeWithoutConstraints(node.width, node.height);
                }

                // Rename component and reposition in tree and on the canvas
                if (parent) {
                    const index = parent.children.indexOf(node);
                    parent.insertChild(index, component);
                }
                component.name = node.name;
                component.x = node.x;
                component.y = node.y;

                if (node.type === "FRAME") {
                    // Save layer tree expanded state
                    component.setPluginData(
                        "expanded",
                        JSON.stringify(node.expanded)
                    );

                    // Append all children in the new component
                    for (const child of node.children) {
                        component.appendChild(child);
                    }
                    node.remove();
                } else {
                    node.x = 0;
                    node.y = 0;
                    component.appendChild(node);
                }

                components.push(component);
            }
        }
        const count = components.length;
        if (count > 0) {
            figma.currentPage.selection = components;

            // Reset expanded state from saved
            for (const component of components) {
                const expanded = component.getPluginData("expanded");
                if (expanded) component.expanded = JSON.parse(expanded);
            }

            figma.notify(`${count} component${count !== 1 ? "s" : ""} created`);
        }
    } else {
        figma.notify("Nothing selected");
    }

    figma.closePlugin();
};

const createComponentFromFrame = (frame: FrameNode): ComponentNode => {
    const component = figma.createComponent();

    // Layout-related properties (excluding position)
    component.rotation = frame.rotation;
    component.resize(frame.width, frame.height);
    component.layoutAlign = frame.layoutAlign;
    component.constraints = frame.constraints;

    // Frame properties
    component.clipsContent = frame.clipsContent;
    // component.guides = clone(frame.guides);
    component.guides = frame.guides;
    // component.layoutGrids = clone(frame.layoutGrids);
    component.layoutGrids = frame.layoutGrids;
    component.gridStyleId = frame.gridStyleId;
    component.layoutMode = frame.layoutMode;
    component.counterAxisSizingMode = frame.counterAxisSizingMode;
    component.horizontalPadding = frame.horizontalPadding;
    component.verticalPadding = frame.verticalPadding;
    component.itemSpacing = frame.itemSpacing;

    // Container-related properties
    component.expanded = frame.expanded;
    // component.backgrounds = clone(frame.backgrounds);
    component.backgrounds = frame.backgrounds;
    component.backgroundStyleId = frame.backgroundStyleId;

    // Geometry-related properties
    // component.fills = clone(frame.fills);
    component.fills = frame.fills;
    // component.strokes = clone(frame.strokes);
    component.strokes = frame.strokes;
    component.expanded = frame.expanded;
    component.strokeWeight = frame.strokeWeight;
    component.strokeMiterLimit = frame.strokeMiterLimit;
    component.strokeAlign = frame.strokeAlign;
    component.strokeCap = frame.strokeCap;
    component.strokeJoin = frame.strokeJoin;
    component.dashPattern = frame.dashPattern;
    component.fillStyleId = frame.fillStyleId;
    component.strokeStyleId = frame.strokeStyleId;
    component.fillStyleId = frame.fillStyleId;

    // Corner-related properties
    component.cornerSmoothing = frame.cornerSmoothing;
    if (frame.cornerRadius === figma.mixed) {
        component.topLeftRadius = frame.topLeftRadius;
        component.topRightRadius = frame.topRightRadius;
        component.bottomLeftRadius = frame.bottomLeftRadius;
        component.bottomRightRadius = frame.bottomRightRadius;
    } else {
        component.cornerRadius = frame.cornerRadius;
    }

    // Blend-related properties
    component.opacity = frame.opacity;
    component.blendMode = frame.blendMode;
    component.isMask = frame.isMask;
    // component.effects = clone(frame.effects);
    component.effects = frame.effects;
    component.effectStyleId = frame.effectStyleId;

    // Export-related properties
    // component.exportSettings = clone(frame.exportSettings);
    component.exportSettings = frame.exportSettings;

    // Frame prototyping-related properties
    component.overflowDirection = frame.overflowDirection;
    component.numberOfFixedChildren = 0; // components cannot have fixed children

    return component;
};

const isParentingNode = (
    node: SceneNode
): node is GroupNode | FrameNode | ComponentNode | InstanceNode =>
    ["GROUP", "FRAME", "COMPONENT", "INSTANCE"].includes(node.type);

const clone = (value: any): any => {
    return JSON.parse(JSON.stringify(value));
};

init();
