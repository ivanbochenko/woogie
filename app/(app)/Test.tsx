// import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
// import { useTheme } from '@react-navigation/native';
// import { useRouter } from 'expo-router';

// import { Button } from '../../components/Button';
// import { BoldText, RegularText } from '../../components/StyledText';
// import { trpcClient } from '../../lib/Client'
// import { useState } from 'react';

// export default function Settings() {
//   const router = useRouter()
//   const { colors } = useTheme()
//   const [text, setText] = useState('')
//   const onPress = async () => {
//     const res = await trpcClient.hello.query('Hono')
//     console.warn(res)
//     setText(res)
//   }

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <BoldText></BoldText>
//         <Button
//           title={'Fetch'}
//           onPress={ onPress }
//         />

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });