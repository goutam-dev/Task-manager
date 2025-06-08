export const sharedStyles = (token, screens) => ({
  container: {
    margin: "0 auto",
    padding: screens.md
      ? `${token.paddingXL}px`
      : `${token.sizeXXL}px ${token.padding}px`,
    width: "380px",
  },
  footer: {
    marginTop: token.marginLG,
    textAlign: "center",
    width: "100%",
  },
  header: {
    marginBottom: token.marginXL,
    textAlign: "center",
  },
  section: {
    backgroundColor: token.colorBgContainer,
    padding: screens.md ? `${token.sizeXXS}px 0px` : "0px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // optional: center vertically
    minHeight: screens.sm ? "100vh" : "auto",
    overflowY: "auto",
  },
  text: {
    color: token.colorTextSecondary,
  },
  title: {
    fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
  },
});
