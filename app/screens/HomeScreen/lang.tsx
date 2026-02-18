import React from 'react';
import { Khanda } from '../../assets/svgs';
import { navigate } from '../../utils/NavigationUtils';
import { Image } from 'react-native';

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
      onPress: () => { },
      Icon: () => <Image source={require('../../assets/images/audio.png')} resizeMode='contain' className='w-24 h-24' />,
    },
    {
      title: 'ਗੁਰਬਾਣੀ ਖੋਜ ਸੁਵਿਧਾ',
      size: 130,
      onPress: () => navigate('GurBaniKhojSuwidhaScreen'),
      Icon: () => <Image source={require('../../assets/images/bookStack.png')} resizeMode='contain' className='w-24 h-24' />,
    },
    {
      title: 'Sikh History',
      size: 130,
      onPress: () => { },
      Icon: () => <Image source={require('../../assets/images/khanda.png')} resizeMode='contain' className='w-24 h-24' />,
    },
    {
      title: 'Gurbani Kosh',
      size: 130,
      onPress: () => { },
      Icon: () => <Image source={require('../../assets/images/book.png')} resizeMode='contain' className='w-24 h-24' />,
    },
  ],
};