// Motion primitives — three only: bloom (entrance), hover, press.
// Plus one timer-only "breathing" exception kept on the timer page.

export const ease = [0.16, 1, 0.3, 1] as const;

export const bloom = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease },
  },
};

export const stagger = (children = 0.07) => ({
  hidden: {},
  show: { transition: { staggerChildren: children } },
});

export const hover = { scale: 1.03 };
export const press = { scale: 0.97 };
