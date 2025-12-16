"use client";

export interface AvatarProps {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export function Avatar({
  name,
  src,
  size = "md",
  color,
  className = "",
}: AvatarProps) {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  // Generate a color from the name if not provided
  const bgColor =
    color || `hsl(${name ? name.charCodeAt(0) * 10 : 0}, 70%, 50%)`;

  if (src) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        className={`${sizes[size]} rounded-full object-cover border-2 border-white ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full border-2 border-white flex items-center justify-center text-white font-medium ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {initial}
    </div>
  );
}

export interface AvatarGroupProps {
  avatars: Array<{ name?: string; src?: string; color?: string }>;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = "md",
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((avatar, i) => (
        <Avatar key={i} {...avatar} size={size} />
      ))}
      {remaining > 0 && (
        <div
          className={`${
            size === "sm"
              ? "w-6 h-6 text-xs"
              : size === "md"
                ? "w-8 h-8 text-xs"
                : "w-10 h-10 text-sm"
          } rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-gray-600 font-medium`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
