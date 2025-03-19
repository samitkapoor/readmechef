import React from 'react';

const IconDetail = ({
  icon,
  value
}: {
  icon: React.ReactNode;
  value: string | number | null | undefined;
}) => {
  return (
    value !== null &&
    value !== undefined &&
    value !== 0 && (
      <div className="flex items-center gap-1">
        {icon} {value}
      </div>
    )
  );
};

export default IconDetail;
