import * as React from "react"
import { cn } from "@/lib/utils"

// Simplified Select for now to avoid installing Radix UI primitives and dealing with complex setup in one go.
// Using native select styled to look like shadcn/ui.

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </select>
            </div>
        )
    }
)
Select.displayName = "Select"

// Mock sub-components to match imports in Trading.tsx
const SelectTrigger = ({ children }: any) => <>{children}</>
const SelectValue = ({ children }: any) => <>{children}</>
const SelectContent = ({ children }: any) => <>{children}</>
const SelectItem = ({ value, children }: any) => <option value={value}>{children}</option>

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
