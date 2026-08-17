

const CourseDetailsSkeleton = () => {
  return (
    <div>
      <div className="flex flex-col items-start gap-6 pt-20">
        {/* heading skeleton */}
        <div className="h-6 w-[60%] rounded-full shimmer" />
        <div className="w-20 h-3 rounded-full shimmer" />

        {/* Card skeleton */}
        <div className="grid grid-cols-2 w-full gap-6">
          <div className="w-full h-16 rounded-xl shimmer" />
          <div className="w-full h-16 rounded-xl shimmer" />
          <div className="col-span-2 w-full h-16 rounded-xl shimmer" />
        </div>
        <div className="w-full h-24 rounded-xl shimmer" />
        <div className="w-full h-24 rounded-xl shimmer" />
      </div>
    </div>
  );
};

export default CourseDetailsSkeleton;
