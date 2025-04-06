declare module 'react-color' {
  export interface ColorResult {
    hex: string;
    rgb: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
    hsl: {
      h: number;
      s: number;
      l: number;
      a: number;
    };
  }

  export interface ChromePickerProps {
    color?: string | { r: number; g: number; b: number; a: number };
    onChange?: (color: ColorResult) => void;
    onChangeComplete?: (color: ColorResult) => void;
    disableAlpha?: boolean;
    styles?: any;
    className?: string;
  }

  export class ChromePicker extends React.Component<ChromePickerProps> {}
} 