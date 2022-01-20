import { FC, ReactNode } from 'react';

const alignmentsRow = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

const alignmentsText = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

type Props = {
  title?: ReactNode;
  titleColor?: 'text-white' | 'text-blueGray-700';
  titleAs: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  titleSize?: 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl' | 'text-4xl';
  description?: ReactNode;
  descriptionColor?: 'text-blueGray-700';
  alignment?: 'left' | 'center' | 'right';
};

const descriptionColorConverter = (textColor: 'text-white' | 'text-blueGray-700', descriptionColor?: string) => {
  if (descriptionColor) return descriptionColor;
  switch (textColor) {
    case 'text-blueGray-700':
      return 'text-blueGray-400';
    default:
      return 'text-white';
  }
};

const CommonHeading: FC<Props> = ({
  titleColor = 'text-blueGray-700',
  title,
  titleAs,
  titleSize = 'text-4xl',
  description,
  descriptionColor,
  alignment = 'left',
}) => {
  const Tag = titleAs;
  return (
    <div className={`flex flex-wrap ${alignmentsRow[alignment]}`}>
      <div className={`relative px-8 w-full ${alignmentsText[alignment]}`}>
        {title && (
          <>
            {typeof title === 'string' ? (
              <Tag className={`${titleSize} font-bold mt-3 mb-1 ${titleColor}`}>{title}</Tag>
            ) : (
              { title }
            )}
          </>
        )}
        <span className={`text-xl leading-relaxed ${descriptionColorConverter(titleColor, descriptionColor)}`}>
          {description}
        </span>
      </div>
    </div>
  );
};

export default CommonHeading;
