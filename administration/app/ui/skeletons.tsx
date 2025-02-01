import clcx from "clsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/app/ui/table";

// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <div className="flex flex-wrap gap-4 justify-between items-center">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function DataChartSkeleton() {
  return (
    <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
      <div className="rounded-xl bg-gray-100 p-4">
        <div className="mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white p-4 sm:grid-cols-13 md:gap-4" />
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-200" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function Skeleton({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={clcx("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export function RecentActivityListSkeleton() {
  return (
    <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-5 w-5 rounded-full bg-gray-200" />
        <div className="h-6 w-48 rounded-md bg-gray-200" />
      </div>
      <div className="space-y-4 bg-white rounded-lg p-2">
        {[...Array(5).keys()].map((index) => (
          <div
            key={index}
            className="flex items-start gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className="w-2 h-2 mt-2 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-gray-100`}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <DataChartSkeleton />
        <RecentActivityListSkeleton />
      </div>
    </>
  );
}

export function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-[150px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[120px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
    </TableRow>
  );
}

export function TableSkeleton() {
  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHead>
          {[...Array(5).keys()].map((index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[120px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[80px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableHead>
      </Table>
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <>
      {[...Array(6).keys()].map((i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse"
        >
          <div className={`${shimmer} relative mb-4 h-48 w-full overflow-hidden rounded-md bg-gray-100`} />
          <div className={`${shimmer} relative mb-2 h-6 w-full overflow-hidden rounded-md bg-gray-100`} />
          <div className={`${shimmer} relative h-10 w-full overflow-hidden rounded-md bg-gray-100`}>
            
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className={`${shimmer} relative h-6 w-20 overflow-hidden rounded-md bg-gray-100`} />
            <div className="flex items-center justify-between gap-2">
              <div className={`${shimmer} relative h-6 w-6 overflow-hidden rounded-md bg-gray-100`} />
              <div className={`${shimmer} relative h-6 w-6 overflow-hidden rounded-md bg-gray-100`} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
