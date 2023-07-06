import { useTheme } from '@react-navigation/native';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import { Icon } from '../../../components/Themed'

export default function TabLayout() {
  const { colors } = useTheme()

  return (
    <Tabs
      initialRouteName='index'
      screenOptions={{
        headerStyle: { 
          backgroundColor: colors.background
        },
        tabBarStyle: {
          backgroundColor: colors.background
        },
        tabBarActiveTintColor: colors.primary,
        tabBarShowLabel: false,
        headerTitle: 'Woogie',
        headerTitleAlign: 'center',
        headerTintColor: colors.primary,
        headerLeft: () => (
          <Link href="/Profile" asChild>
            <Pressable>
              {({ pressed }) => (
                <Icon
                  name="user"
                  size={30}
                  color={colors.text}
                  style={{ marginLeft: 15, opacity: pressed ? 0.2 : 0.5 }}
                />
              )}
            </Pressable>
          </Link>
        ),
        headerRight: () => (
          <Link href="/Settings" asChild>
            <Pressable>
              {({ pressed }) => (
                <Icon
                  name="cog"
                  size={30}
                  color={colors.text}
                  style={{ marginRight: 15, opacity: pressed ? 0.2 : 0.5 }}
                />
              )}
            </Pressable>
          </Link>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <Icon size={30} style={{width: 30}} name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="last-event"
        options={{
          title: 'Last Event',
          tabBarIcon: ({ color }) => <Icon size={30} style={{width: 30}} name="ticket" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => <Icon size={30} style={{width: 30}} name="comments" color={color} />,
        }}
      />
    </Tabs>
  );
}
