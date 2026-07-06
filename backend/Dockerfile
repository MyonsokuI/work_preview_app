# 1. 軽いJava環境（JRE）をベースにする
FROM eclipse-temurin:17-jre-alpine

# 2. コンテナ内の作業ディレクトリ
WORKDIR /app

# 3. 事前にビルドしたSpring Bootのjarファイルをコンテナにコピー
# ※ビルドツールがGradleの場合は build/libs/*.jar になります
COPY target/*.jar app.jar

# 4. ポート8080を開放
EXPOSE 8080

# 5. アプリを起動
CMD ["java", "-jar", "app.jar"]
