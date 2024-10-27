const icons: Record<string, { css: string, name: string }> = {
    "status": { css: "iconoir-", name: "" },
    "stage": { css: "iconoir-", name: "" },
    "rate": { css: "iconoir-", name: "" },
    "next-output": { css: "iconoir-", name: "" },
    "stack-light": { css: "iconoir-", name: "" },

    // stages
    "stage-loading": { css: "iconoir-", name: "" },
    "stage-processing": { css: "iconoir-", name: "" },
    "stage-emptying": { css: "iconoir-", name: "" },

    // status
    "status-running": { css: "iconoir-", name: "" },
    "status-backpressure": { css: "iconoir-", name: "" },
    "status-blocked": { css: "iconoir-", name: "" },
    "status-stopped": { css: "iconoir-", name: "" },

    // connections
    "connection-pipe": { css: "iconoir-", name: "" },
    "connection-pole": { css: "iconoir-", name: "" },
    "connection-belt": { css: "iconoir-", name: "" },

    // resources
    "resource-iron-ore": { css: "iconoir-", name: "" },
    "resource-power": { css: "iconoir-", name: "" },
    "resource-iron-alloy": { css: "iconoir-", name: "" },
    "resource-water": { css: "iconoir-", name: "" },
} as const;

const tags: Record<string, string> = {
    "off": "off",
    "powered": "filter-bright",
    "pulse": "animate-pulse",
    "steady": "animate-steady"
} as const;
