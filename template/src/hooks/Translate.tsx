import {useTranslation} from 'react-i18next';

const Translate = (val: any) => {
  const {t} = useTranslation();
  return t(val);
};

export default Translate;
