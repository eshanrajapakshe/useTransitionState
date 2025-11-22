import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  Dispatch,
  SetStateAction,
  RefObject,
  CSSProperties,
} from "react";

export type TransitionEffectType = "fade" | "slide" | "zoom";

export interface AnimationKeyframes {
  from: CSSProperties;
  to: CSSProperties;
}

export type TransitionEffect = TransitionEffectType | AnimationKeyframes;

export interface TransitionOptions {
  duration?: number;
  effect?: TransitionEffect;
  timingFunction?: string;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
}

type UseTransitionReturn<T> = [
  boolean,
  Dispatch<SetStateAction<boolean>>,
  RefObject<T>
];

const PRESETS: Record<TransitionEffectType, AnimationKeyframes> = {
  fade: {
    from: { opacity: "0" },
    to: { opacity: "1" },
  },
  slide: {
    from: { transform: "translateY(-20px)", opacity: "0" },
    to: { transform: "translateY(0)", opacity: "1" },
  },
  zoom: {
    from: { transform: "scale(0.95)", opacity: "0" },
    to: { transform: "scale(1)", opacity: "1" },
  },
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useTransitionState<T extends HTMLElement>(
  initialValue: boolean = false,
  options: TransitionOptions = {}
): UseTransitionReturn<T> {
  const {
    duration = 300,
    effect = "fade",
    timingFunction = "ease-in-out",
    onEnter,
    onEntered,
    onExit,
    onExited,
  } = options;

  const [isVisible, setIsVisible] = useState<boolean>(initialValue);
  const [shouldRender, setShouldRender] = useState<boolean>(initialValue);
  const elementRef = useRef<T>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const getEffectConfig = (): AnimationKeyframes => {
    if (typeof effect === "string") {
      return PRESETS[effect as TransitionEffectType] || PRESETS.fade;
    }
    return effect;
  };

  const applyStyle = (styles: CSSProperties) => {
    if (elementRef.current) {
      Object.assign(elementRef.current.style, styles);
    }
  };

  useEffect(() => {
    if (isVisible) {
      if (onEnter) onEnter();
      setShouldRender(true);
      return;
    }

    if (!shouldRender) return;

    if (onExit) onExit();

    const config = getEffectConfig();

    if (elementRef.current) {
      elementRef.current.style.transition = `all ${duration}ms ${timingFunction}`;
      applyStyle(config.from);
    }

    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setShouldRender(false);
        if (onExited) onExited();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, effect, timingFunction]);

  useIsomorphicLayoutEffect(() => {
    if (isVisible && shouldRender && elementRef.current) {
      const config = getEffectConfig();

      elementRef.current.style.transition = "none";
      applyStyle(config.from);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!elementRef.current) return;

          elementRef.current.style.transition = `all ${duration}ms ${timingFunction}`;
          applyStyle(config.to);

          setTimeout(() => {
            if (isMountedRef.current && onEntered) onEntered();
          }, duration);
        });
      });
    }
  }, [shouldRender, isVisible]);

  return [shouldRender, setIsVisible, elementRef];
}
