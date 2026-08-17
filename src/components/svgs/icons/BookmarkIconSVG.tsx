interface IconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  fillColor ?: string;
}

export default function BookmarkIconSvg({
  width = 20,
  height = 20,
  className,
  fillColor = "none",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" 
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      className={className}
    >
      <path
      fill={fillColor}
        stroke="#fff"
        strokeWidth="1.5"
        d="m9.582 13.893-3.02 2.048A1 1 0 0 1 5 15.114V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v11.043a1 1 0 0 1-1.586.81l-2.685-1.942a1 1 0 0 0-1.147-.018Z"
      ></path>
    </svg>
  );
}
