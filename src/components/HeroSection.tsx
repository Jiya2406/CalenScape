import { format, getMonth } from 'date-fns';

interface HeroSectionProps {
  currentMonth: Date;
}

const monthImages = [
  'https://picsum.photos/id/1018/800/600', // January: Mountains
  'https://picsum.photos/id/1015/800/600', // February: River Valley
  'https://picsum.photos/id/1016/800/600', // March: Mountain Canyon
  'https://picsum.photos/id/1043/800/600', // April: Forest/Lake
  'https://picsum.photos/id/1044/800/600', // May: Lake
  'https://picsum.photos/id/1047/800/600', // June: Field
  'https://picsum.photos/id/1050/800/600', // July: Starry Sky/Trees
  'https://picsum.photos/id/16/800/600',   // August: Forest
  'https://picsum.photos/id/28/800/600',   // September: Forest trees
  'https://picsum.photos/id/29/800/600',   // October: Mountains
  'https://picsum.photos/id/10/800/600',   // November: Forest Path
  'https://picsum.photos/id/1039/800/600'  // December: Waterfall
];

const HeroSection = ({ currentMonth }: HeroSectionProps) => {
  const currentImage = monthImages[getMonth(currentMonth)];

  return (
    <div className="hero-section">
      <div className="hero-image-container">
        <img src={currentImage} alt={`${format(currentMonth, 'MMMM')} CalenScape Hero`} className="hero-image" />
        <div className="hero-overlay">
          <h2>{format(currentMonth, 'MMMM')}</h2>
          <p>{format(currentMonth, 'yyyy')}</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
