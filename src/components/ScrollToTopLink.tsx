import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface ScrollToTopLinkProps extends LinkProps {
  className?: string;
  onClick?: () => void;
}

export default function ScrollToTopLink({ children, onClick, ...props }: ScrollToTopLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    window.scrollTo(0, 0);
    if (onClick) onClick();
  };

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
