import Image, { ImageProps } from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerVariants = cva("bg-muted relative block shrink-0 overflow-hidden rounded-lg", {
  variants: {
    size: {
      /* Large: 16:9比率を維持し、親の幅に合わせる */
      lg: "aspect-[16/9] w-full",
      /* Small: 96px(size-24)固定、1:1比率 */
      sm: "size-24",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

interface ResponsiveImageProps
  extends Omit<ImageProps, "width" | "height">, VariantProps<typeof containerVariants> {
  containerClassName?: string;
}

function ResponsiveImage({
  className,
  containerClassName,
  size,
  alt,
  src,
  ...props
}: ResponsiveImageProps) {
  return (
    <div className={cn(containerVariants({ size }), containerClassName)}>
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover transition-all", className)}
        sizes={size === "sm" ? "96px" : "(max-width: 768px) 100vw, 50vw"}
        {...props}
      />
    </div>
  );
}

export { ResponsiveImage, containerVariants };
