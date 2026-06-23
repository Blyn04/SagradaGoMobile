package utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public final class EnvUtils {

    private static final Map<String, String> DOT_ENV = loadDotEnv();

    private EnvUtils() {
    }

    public static String get(String key) {
        String fromSystem = System.getenv(key);
        if (fromSystem != null && !fromSystem.isBlank()) {
            return fromSystem.trim();
        }

        String fromFile = DOT_ENV.get(key);
        return fromFile != null ? fromFile : "";
    }

    private static Map<String, String> loadDotEnv() {
        Map<String, String> values = new HashMap<>();

        for (Path envFile : candidateEnvFiles()) {
            if (!Files.isRegularFile(envFile)) {
                continue;
            }

            try {
                for (String line : Files.readAllLines(envFile)) {
                    parseLine(line, values);
                }
                System.out.println("[EnvUtils] Loaded credentials from " + envFile.toAbsolutePath());
                return values;
            } catch (IOException e) {
                System.out.println("[EnvUtils] Could not read " + envFile + ": " + e.getMessage());
            }
        }

        return values;
    }

    private static Path[] candidateEnvFiles() {
        Path cwd = Paths.get(System.getProperty("user.dir")).toAbsolutePath().normalize();
        return new Path[] {
                cwd.resolve(".env"),
                cwd.resolve("..").resolve(".env").normalize(),
                cwd.resolve("..").resolve("..").resolve("sagra-mob").resolve(".env").normalize()
        };
    }

    private static void parseLine(String line, Map<String, String> values) {
        String trimmed = line.trim();
        if (trimmed.isEmpty() || trimmed.startsWith("#")) {
            return;
        }

        int separator = trimmed.indexOf('=');
        if (separator < 0) {
            return;
        }

        String key = trimmed.substring(0, separator).trim();
        String value = unquote(trimmed.substring(separator + 1).trim());
        values.put(key, value);
    }

    private static String unquote(String value) {
        if (value.length() >= 2) {
            char first = value.charAt(0);
            char last = value.charAt(value.length() - 1);
            if ((first == '"' && last == '"') || (first == '\'' && last == '\'')) {
                return value.substring(1, value.length() - 1);
            }
        }
        return value;
    }
}
