import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";

interface GuidelinesModalProps {
  visible: boolean;
  onClose: () => void;
}

const GuidelineItem = ({
  number,
  icon,
  text,
  boldText,
  subText,
  children,
}: {
  number: string;
  icon: string;
  text: string;
  boldText?: string;
  subText?: string;
  children?: React.ReactNode;
}) => (
  <View className="mb-4">
    <Text className="text-base text-textprimary">
      <Text className="text-base font-semibold">{number}. </Text>
      <Text className="text-base">{icon} </Text>
      <Text className="text-base">{boldText ? "" : text}</Text>
      {boldText ? (
        <Text className="text-base font-bold">{boldText}</Text>
      ) : null}
      {text && boldText ? <Text className="text-base">{text}</Text> : null}
    </Text>
    {subText ? (
      <Text className="mt-1 pl-6 text-sm text-textsecondary">{subText}</Text>
    ) : null}
    {children ? <View className="mt-1 pl-6">{children}</View> : null}
  </View>
);

const SubListItem = ({ label }: { label: string }) => (
  <Text className="mb-1 pl-6 text-sm text-textprimary">{label}</Text>
);

const LinkText = () => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel="Click here for Referral Screenshot"
  >
    <Text className="mt-1 text-sm font-bold text-info underline">
      Click here for Referral Screenshot
    </Text>
  </TouchableOpacity>
);

export default function GuidelinesModal({
  visible,
  onClose,
}: GuidelinesModalProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768 && Platform.OS === "web";
  const isMobile = width < 640;

  const modalWidth = isMobile
    ? "w-full"
    : isDesktop
      ? "max-w-[800px]"
      : "w-[90%]";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 items-center justify-center bg-black/55 p-4">
        <View
          className={`${modalWidth} max-h-[90%] rounded-2xl bg-surface shadow-xl`}
          style={isMobile ? { borderRadius: 16 } : {}}
        >
          {/* Header */}
          <View className="flex-row items-center border-b border-border px-5 py-4">
            <Text className="flex-1 text-center text-base font-bold text-info underline">
              {"⚠️ Usage Guidelines for a Smooth & Secure Experience"}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="ml-2 h-8 w-8 items-center justify-center rounded-lg border border-info"
              accessibilityRole="button"
              accessibilityLabel="Close guidelines modal"
            >
              <Text className="text-base font-bold text-textmuted">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView className="px-5 py-4" keyboardShouldPersistTaps="handled">
            {/* Guidelines */}
            <GuidelineItem number="1" icon="🖥️" text="Use a desktop or laptop for filing" />

            <GuidelineItem number="2" icon="✅" text="Use Google Chrome for the best experience." />

            <GuidelineItem
              number="3"
              icon="🔄"
              boldText="Avoid using the browser's back/refresh buttons while filling forms"
              text=""
              subText="Use only the in-app navigation to avoid losing unsaved data."
            />

            <GuidelineItem
              number="4"
              icon="🍪"
              boldText="Enable Cookies in Chrome:"
              text=""
            >
              <SubListItem label="a. Open Chrome." />
              <SubListItem label="b. Click the three dots (:) at the top-right > select Settings." />
              <SubListItem label="c. Go to Privacy and security > Cookies and other site data." />
              <SubListItem label='d. Select "Allow all cookies" or "Block third-party cookies in Incognito".' />
              <LinkText />
            </GuidelineItem>

            <GuidelineItem
              number="5"
              icon="🆔"
              boldText="Allow pop-ups for this site"
              text=""
              subText="Some downloads (like acknowledgment files or preview forms) may open in a new tab or pop-up."
            >
              <SubListItem label="a. Go to Chrome > Settings > Privacy and security > Site Settings > Pop-ups and redirects > Allow for https://mytaxassist.in." />
              <SubListItem label="b. You may add https://mytaxassist.in to the allow list if prompted." />
              <LinkText />
            </GuidelineItem>

            <GuidelineItem
              number="6"
              icon="🔴"
              boldText="Do not leave forms open or unattended,"
              text=" especially on shared or public computers."
            />

            <GuidelineItem
              number="7"
              icon="🔐"
              boldText="Logout immediately"
              text=" after use to keep your financial data secure."
            />

            <GuidelineItem
              number="8"
              icon="❌"
              boldText="Never share your login credentials"
              text=" with anyone."
            />

            <GuidelineItem
              number="9"
              icon="🔄"
              boldText="If you face issues like freezing or errors, please logout and login again to reset your session."
              text=""
            />

            {/* Support Section */}
            <View className="mt-2 rounded-lg border border-border bg-card p-4">
              <Text className="mb-2 text-base font-bold text-textprimary">
                {"📞 Need Help? Contact Our Support Team:"}
              </Text>
              <Text className="mb-1 text-sm text-textprimary">
                {"📱 Support Helpline 1  Mitali Gosher: +91-9845150061"}
              </Text>
              <Text className="mb-1 text-sm text-textprimary">
                {"📱 Support Helpline 2  Dhanush K: +91-8073522024"}
              </Text>
              <Text className="text-sm text-textprimary">
                {"🕐 Support Hours: Monday to Saturday, 11:00 AM - 7:00 PM"}
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              className="mx-auto mb-2 mt-4 w-full max-w-[200px] items-center rounded-lg bg-info py-3"
              accessibilityRole="button"
              accessibilityLabel="Close guidelines"
            >
              <Text className="text-base font-bold text-white">Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
