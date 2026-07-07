import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  startDate: string;
  endDate: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
}

const DateRangePicker: React.FC<Props> = ({ startDate, endDate, onStartChange, onEndChange }) => {
  const { t } = useTranslation();
  return (
    <div className="date-range-picker">
      <label>
        {t('common.from')}
        <input type="date" value={startDate} onChange={e => onStartChange(e.target.value)} />
      </label>
      <label>
        {t('common.to')}
        <input type="date" value={endDate} onChange={e => onEndChange(e.target.value)} />
      </label>
    </div>
  );
};

export default DateRangePicker;