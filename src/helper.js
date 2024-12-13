import Swal from "sweetalert2";

class Helper {
  showAlert = (title, text, icon = "info") => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        icon,
        title,
        text,
      }).then((response) => {
        return resolve(response.isConfirmed);
      });
    });
  };

  showLoadingIndicator = () => {
    Swal.fire({
      title: "loading...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Start the loading spinner
      },
    });
  };

  showPrompt = async (
    title,
    text,
    icon = "info",
    confirmButtonText = "Yes",
    cancelButtonText = "No"
  ) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
      }).then((response) => {
        return resolve(response.isConfirmed);
      });
    });
  };

  hideAlert = () => {
    Swal.close();
  };

  sendData = async (sendz) => {
    this.showLoadingIndicator();

    try {
      const options = {
        method: `${sendz.methodType}`,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (["POST", "PUT", "PATCH"].includes(sendz.methodType.toUpperCase())) {
        options.body = JSON.stringify(sendz);
      }

      // const request = await fetch(
      //   `http://127.0.0.1:8000/${sendz.url}`,
      //   options
      // );
      const request = await fetch(
        `https://todobackend-production-0720.up.railway.app/${sendz.url}`,
        options
      );

      const responseData = await request.json();

      return responseData;
    } catch (error) {
      this.hideAlert();
      throw new Error(error);
    } finally {
      this.hideAlert();
    }
  };

  validateField = (field) => {
    return field && field.trim() !== "";
  };

  truncateText = (text, maxLength, ellipsis = "...") => {
    if (text.length <= maxLength) {
      return text;
    }

    return text.substring(0, maxLength) + ellipsis;
  };
}

const helper = new Helper();

export default helper;
