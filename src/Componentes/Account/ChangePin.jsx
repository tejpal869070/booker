import React, { useEffect, useState } from "react";
import gif1 from "../../assets/photos/giff1.gif"

export default function ChangePin() {
  const [animation, setAnimation] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimation(false);
    }, 2000);
  }, []);

  if (animation) {
    return (
      <div className="absolute w-full h-full flex items-center justify-center align-center inset-0 bg-white z-[999999]">
        <img alt="animation" src={gif1} className="w-60"/>
      </div>
    );
  }

  return <div>Change</div>;
}
