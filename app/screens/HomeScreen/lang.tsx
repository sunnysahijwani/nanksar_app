import React from 'react';
import { Khanda } from '../../assets/svgs';
import { navigate } from '../../utils/NavigationUtils';

interface ContainerItem {
  title: string;
  size: number;
  onPress: () => void;
  Icon: React.FC;
}

export const lang: { containerItems: ContainerItem[] } = {
  containerItems: [
    {
      title: 'Audio',
      size: 130,
      onPress: () => {},
      Icon: () => <Khanda width={90} height={90} />,
    },
    {
      title: 'ਗੁਰਬਾਣੀ ਖੋਜ ਸੁਵਿਧਾ',
      size: 130,
      onPress: () => navigate('GurBaniKhojSuwidhaScreen'),
      Icon: () => <Khanda width={90} height={90} />,
    },
    {
      title: 'Sikh History',
      size: 130,
      onPress: () => {},
      Icon: () => <Khanda width={90} height={90} />,
    },
    {
      title: 'Gurbani Kosh',
      size: 130,
      onPress: () => {},
      Icon: () => <Khanda width={90} height={90} />,
    },
  ],
};
