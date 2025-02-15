import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { createStyles } from "./ModalCreateAccount";
import { HandleCloseInterface } from "../../../src/services/props";

export function ModalForgotPassword({ handleClose }: { handleClose: HandleCloseInterface }) {
  const [email, setEmail] = useState<string>();
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.textTitle}>Forgot your password?</Text>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text style={styles.textLabel}>email</Text>
          <TextInput
            placeholder="name@email.com"
            placeholderTextColor={"#ccc"}
            style={styles.input}
            value={email?.toLowerCase()}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.buttonContent}>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.textButton}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonCreate]}
            onPress={() => alert(email)}
          ><Text style={[styles.textButton, { color: "#fff" }]}>
              {englishLanguage ? "Send" : "Enviar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}