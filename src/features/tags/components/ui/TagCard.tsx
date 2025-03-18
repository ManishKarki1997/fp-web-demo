import { TagCardColors } from '../../constants/TagConstants';
import { TagTypeWithCount } from '../../types/TagTypes'
import { cn } from '@/lib/utils';

type Props = {
  tag: TagTypeWithCount;
  idx?: number;
  selected?: boolean;
  onClick?: (tag: TagTypeWithCount) => void;
}

const TagCard = ({ tag, idx, selected, onClick = () => { } }: Props) => {
  return (
    <div
      onClick={() => onClick(tag)}
      className={cn(selected && "bg-secondary", 'flex-1 flex items-center gap-4 rounded-lg px-6 py-2 hover:bg-secondary border hover:shadow-sm cursor-pointer')}>
      <div style={{
        backgroundColor: !idx ? TagCardColors[0] : TagCardColors[idx % TagCardColors.length]
      }} className="w-3 h-3 rounded-full "></div>
      <h2 className='font-medium'>
        {tag.name}
        <span className='text-sm ml-1'>({tag.count})</span>
      </h2>
    </div>
  )
}

export default TagCard