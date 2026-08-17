

const SwipeCardSkeleton = () => {
  return (
     <div className="flex flex-col items-center gap-6">
      {/* Softbadge skeleton */}
      <div className="h-6 w-60 rounded-full shimmer" />

      {/* Card skeleton */}
      <div className="w-72.5 h-72.5 rounded-xl shimmer" />

      {/* Buttons skeleton */}
      <div className="flex w-full justify-between gap-4 mt-10">
        <div className="w-12 h-12 rounded-full shimmer" />
        <div className="w-12 h-12 rounded-full shimmer" />
      </div>
    </div>
  )
}

export default SwipeCardSkeleton