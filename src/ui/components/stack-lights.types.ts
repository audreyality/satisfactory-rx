type LightBehavior = "on" | "blink" | "off";

type StackStatus = {
    red: LightBehavior;
    yellow: LightBehavior;
    green: LightBehavior;
    blue?: LightBehavior;
    white?: LightBehavior;
}

const optionalLights = ["blue", "white"] as const;
type OptionalLights = (typeof optionalLights)[number];
