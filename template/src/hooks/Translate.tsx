import i18n from '../Localization/Localize';

const Translate = (key: string): string => {
  return i18n.t(key);
};

export default Translate;
