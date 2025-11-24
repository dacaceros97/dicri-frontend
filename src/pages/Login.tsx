import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Avatar,
  CssBaseline,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 4 }}
    >
      {"DICRI © "}
      {new Date().getFullYear()}
      {". Ministerio Público."}
    </Typography>
  );
}

const whiteInputStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
  },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 1000px white inset",
    WebkitTextFillColor: "black",
  },
};

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { correo, password });

      if (response.data.success) {
        const token = response.data.data.token;
        const userName = response.data.data.user.nombre || "Usuario";

        login(token);

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
            if (toast.parentElement) {
              toast.parentElement.style.zIndex = "99999";
            }
          },
        });

        Toast.fire({
          icon: "success",
          title: `¡Bienvenido, ${userName}!`,
        });

        navigate("/dashboard");
      }
    } catch (err: unknown) {
      let msg = "Ocurrió un error inesperado";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || "Error de conexión";
      }

      Swal.fire({
        icon: "error",
        title: "Acceso Denegado",
        text: msg,
        confirmButtonColor: "#d33",
        allowOutsideClick: !msg.includes("bloqueado"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#e0e0e0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          elevation={10}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#1976d2", width: 56, height: 56 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>

          <Typography
            component="h1"
            variant="h5"
            fontWeight="bold"
            sx={{ mt: 1 }}
          >
            Acceso DICRI
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sistema de Control de Evidencias
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Institucional"
              name="email"
              autoComplete="email"
              autoFocus
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              sx={whiteInputStyle}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={whiteInputStyle}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {loading ? "VERIFICANDO..." : "INGRESAR AL SISTEMA"}
            </Button>
          </Box>
        </Paper>
        <Copyright />
      </Container>
    </Box>
  );
}
