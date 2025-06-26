import React from 'react';

type KPICardProps = {
  item: {
    title: string;
    category: 'E' | 'S' | 'G';
    impact?: string;
    period: string;
    role?: string;
    emphasis: 'extra-high' | 'high' | 'normal';
    thumbnail?: string;
    slug: string;
  };
  onClick?: () => void;
};

const KPICard: React.FC<KPICardProps> = ({ item, onClick }) => {
  const { title, category, impact, emphasis, thumbnail, slug } = item;

  const categoryStyles = {
    E: 'border-green-400',
    S: 'border-blue-400',
    G: 'border-orange-400',
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'E') return '🌱';
    if (category === 'S') return '👥';
    if (category === 'G') return '🏛️';
    return '';
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  let cardSizeClass = '';
  switch (emphasis) {
    case 'extra-high':
      cardSizeClass = 'lg:col-span-2';
      break;
    case 'high':
      cardSizeClass = 'lg:row-span-2';
      break;
    default:
      cardSizeClass = '';
      break;
  }
  
  const anchorId = `#esg-item-${slug}`;

  return (
    <a 
      href={anchorId} 
      onClick={handleClick}
      className={`relative block group w-full h-full rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 ${cardSizeClass}`}
    >
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300 ease-in-out group-hover:scale-110"
        style={{ backgroundImage: `url(${thumbnail})` }}
      ></div>

      <div className="absolute inset-0 w-full h-full bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-colors duration-300"></div>
      
      <div className={`relative h-full flex flex-col justify-center items-center text-center p-6 text-white border-4 border-transparent ${categoryStyles[category]}`}>
        <p className="font-extrabold text-2xl leading-tight drop-shadow-md">
          {impact}
        </p>
        <h4 className="text-base mt-2 opacity-90 font-medium drop-shadow-sm">
          {title}
        </h4>
      </div>
      
      <span className="absolute top-4 right-4 text-sm font-bold bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1">
        <span className="text-base">{getCategoryIcon(category)}</span>
        {category}
      </span>
    </a>
  );
};

export default KPICard; 