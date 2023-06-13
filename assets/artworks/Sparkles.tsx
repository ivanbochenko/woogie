import * as React from "react";
import Svg, { SvgProps, Path, G } from "react-native-svg";

export const Sparkles = (props: SvgProps) => {
  return (
    <Svg
      data-name="Layer 1"
      width={24}
      height={24}
      enable-background="new 0 0 128 128"
      viewBox="0 0 128 128"
      {...props}
    >
      <Path
        d="m121.59 60.83-13.93-4.49c-8.91-2.94-14.13-10.15-16.58-19.21l-6.13-29.86c-.16-.59-.55-1.38-1.75-1.38-1.01 0-1.59.79-1.75 1.38l-6.13 29.87c-2.46 9.06-7.67 16.27-16.58 19.21l-13.93 4.49c-1.97.64-2 3.42-.04 4.09l14.03 4.83c8.88 2.95 14.06 10.15 16.52 19.17l6.14 29.53c.16.59.49 1.65 1.75 1.65 1.33 0 1.59-1.06 1.75-1.65l6.14-29.53c2.46-9.03 7.64-16.23 16.52-19.17l14.03-4.83c1.94-.68 1.91-3.46-.06-4.1z"
        fill="#46aef7"
      />
      <Path
        d="m122.91 62.08c-.22-.55-.65-1.03-1.32-1.25l-13.93-4.49c-8.91-2.94-14.13-10.15-16.58-19.21l-6.13-29.86c-.09-.34-.41-.96-.78-1.14l1.98 29.97c1.47 13.68 2.73 20.12 13.65 22 9.38 1.62 20.23 3.48 23.11 3.98z"
        fill="#222844"
      />
      <Path
        d="m122.94 63.64-24.16 5.54c-8.51 2.16-13.2 7.09-13.2 19.99l-2.37 30.94c.81-.08 1.47-.52 1.75-1.65l6.14-29.53c2.46-9.03 7.64-16.23 16.52-19.17l14.03-4.83c.66-.24 1.08-.73 1.29-1.29z"
        fill="#222844"
      />
      
      <Path
        d="m41.81 86.81c-8.33-2.75-9.09-5.85-10.49-11.08l-3.49-12.24c-.21-.79-2.27-.79-2.49 0l-2.37 11.31c-1.41 5.21-4.41 9.35-9.53 11.04l-8.16 3.54c-1.13.37-1.15 1.97-.02 2.35l8.22 2.91c5.1 1.69 8.08 5.83 9.5 11.02l2.37 10.82c.22.79 2.27.79 2.48 0l2.78-10.77c1.41-5.22 3.57-9.37 10.5-11.07l7.72-2.91c1.13-.39 1.12-1.99-.02-2.36z"
        fill="#46aef7"
      />
      <Path
        d="m28.49 75.55c.85 7.86 1.28 10.04 7.65 11.67l13.27 2.59c-.14-.19-.34-.35-.61-.43l-7-2.57c-7.31-2.5-9.33-5.68-10.7-12.04s-2.83-10.51-2.83-10.51c-.51-1.37-1.24-1.3-1.24-1.3z"
        fill="#222844"
      />
      <G>
        <Path
          d="m28.73 102.99c0-7.41 4.05-11.08 10.49-11.08l10.02-.41s-.58.77-1.59 1.01l-6.54 2.13c-5.55 2.23-8.08 3.35-9.8 10.94 0 0-2.22 8.83-2.64 9.76-.58 1.3-1.27 1.57-1.27 1.57z"
        />
        <Path
          stroke="#46aef7"
          stroke-miterlimit="10"
          d="m59.74 28.14c.56-.19.54-.99-.03-1.15l-7.72-2.08c-1.62-.44-2.88-1.69-3.34-3.3l-3.04-12.55c-.15-.61-1.02-.61-1.17.01l-2.86 12.5c-.44 1.66-1.74 2.94-3.4 3.37l-7.67 1.99c-.57.15-.61.95-.05 1.15l8.09 2.8c1.45.5 2.57 1.68 3.01 3.15l2.89 11.59c.15.6 1.01.61 1.16 0l2.99-11.63c.45-1.47 1.58-2.64 3.04-3.13z"
          fill='#46aef7'
        />
      </G>
    </Svg>
  )
}
