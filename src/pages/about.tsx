import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';

const About: NextPage = () => {
  const [activeAnimation, setActiveAnimation] = useState(false);

  useEffect(() => {
    setActiveAnimation(true);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }, []);

  return (
    <div
      className={`container mx-auto ${
        activeAnimation ? 'translate-y-0 opacity-100' : 'translate-y-48 opacity-0'
      } transition duration-1000`}
    >
      <Image
        src="/images/about_page.jpg"
        alt="About"
        width="100%"
        height="100%"
        objectFit="contain"
        layout="responsive"
        priority={true}
      />
    </div>
  );
};

export default About;
