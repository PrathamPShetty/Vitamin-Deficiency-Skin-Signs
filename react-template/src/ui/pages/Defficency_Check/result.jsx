
const CardSkeleton = () => {

    return (
  
      <div className="card-skeleton">
  
        <div>
  
          <Skeleton circle width={50} height={50} />  {/* Placeholder for an image */}
  
        </div>
  
        <div>
  
          <Skeleton count={2} />  {/* Placeholder for a title with multiple lines */}
  
        </div>
  
        <div>
  
          <Skeleton count={3} />  {/* Placeholder for a description */}
  
        </div>
  
      </div>
  
    );
  
  };
  