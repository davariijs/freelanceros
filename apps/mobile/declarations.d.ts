import "react-native";

declare module "react-native" {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface KeyboardAvoidingViewProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
}

declare module "@react-native-community/netinfo" {
  export interface NetInfoState {
    isConnected: boolean | null;
  }
  const NetInfo: {
    addEventListener: (listener: (state: NetInfoState) => void) => () => void;
  };
  export default NetInfo;
}

declare module "@shopify/flash-list" {
  import * as React from "react";
  import { ScrollViewProps } from "react-native";

  export interface FlashListProps<T> extends ScrollViewProps {
    data: T[] | null | undefined;
    renderItem: (info: { item: T; index: number }) => React.ReactNode;
    estimatedItemSize: number;
    showsVerticalScrollIndicator?: boolean;
    contentContainerStyle?: any;
    keyExtractor?: (item: T, index: number) => string;
  }
  export function FlashList<T>(props: FlashListProps<T>): React.ReactNode;
}
