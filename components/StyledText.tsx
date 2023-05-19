import { Text, TextProps, InputProps, Input } from './Themed';
import { s, m, l, xl } from '../constants/Spaces';

export function RegularText(props: TextProps) {
  return <Text {...props} style={[{ fontFamily: 'Lato_400Regular', fontSize: l - 4 }, props.style ]} />;
}

export function BoldText(props: TextProps) {
  return <Text {...props} style={[{ fontFamily: 'Lato_700Bold', fontSize: l }, props.style ]} />;
}

export function TextInput(props: InputProps) {
  return <Input
    {...props} 
    placeholderTextColor={"grey"}
    style={[
      {
        fontFamily: 'Lato_400Regular',
        width: '100%',
        padding: m,
        borderRadius: m,
        marginTop: m,
        minHeight: 40,
      },
      props.style
    ]}
  />
}