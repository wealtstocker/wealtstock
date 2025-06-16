import { useEffect } from "react"
import Swal from "sweetalert2"

const useBeforeUnload = () => {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = "" // Needed for some browsers to trigger prompt

      // Custom SweetAlert for user navigation
      // Swal.fire({
      //   title: "Are you sure?",
      //   text: "Your data may be lost. Do you really want to leave?",
      //   icon: "warning",
      //   showCancelButton: true,
      //   confirmButtonText: "Yes, leave",
      //   cancelButtonText: "Stay",
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     window.removeEventListener("beforeunload", handleBeforeUnload)
      //     window.location.href = window.location.href 
      //   }
      // })

      return ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])
}

export default useBeforeUnload
