import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import api from "../api/axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface IndicioForm {
  descripcion: string;
  color: string;
  tamano: string;
  peso: string;
  ubicacion: string;
}

const indicioInicial: IndicioForm = {
  descripcion: "",
  color: "",
  tamano: "",
  peso: "",
  ubicacion: "",
};

export default function CreateExpediente() {
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState("");
  const [indicioActual, setIndicioActual] =
    useState<IndicioForm>(indicioInicial);
  const [listaIndicios, setListaIndicios] = useState<IndicioForm[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChangeIndicio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIndicioActual({ ...indicioActual, [e.target.name]: e.target.value });
  };

  const handleAddIndicio = () => {
    if (!indicioActual.descripcion || !indicioActual.ubicacion) {
      Swal.fire(
        "Faltan datos",
        "Descripción y Ubicación son obligatorios para el indicio",
        "warning"
      );
      return;
    }
    setListaIndicios([...listaIndicios, indicioActual]);
    setIndicioActual(indicioInicial);
  };

  const handleRemove = (index: number) => {
    const nuevaLista = [...listaIndicios];
    nuevaLista.splice(index, 1);
    setListaIndicios(nuevaLista);
  };

  const handleSaveAll = async () => {
    if (!codigo) {
      Swal.fire(
        "Campo requerido",
        "El Código del expediente es obligatorio",
        "warning"
      );
      return;
    }
    if (listaIndicios.length === 0) {
      Swal.fire("Sin evidencia", "Debe agregar al menos un indicio", "warning");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        codigo,
        indicios: listaIndicios,
      };

      const response = await api.post("/expedientes", payload);

      if (response.data.success) {
        await Swal.fire({
          title: "¡Expediente Creado!",
          text: `El expediente ${codigo} y sus indicios han sido registrados.`,
          icon: "success",
          confirmButtonText: "Entendido",
        });
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      let msg = "Ocurrió un error inesperado";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || "Error al guardar";
      }
      Swal.fire("Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Nuevo Ingreso de Evidencia
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          Datos del Expediente
        </Typography>
        <TextField
          label="Código de Expediente (Ej: EXP-2024-001)"
          fullWidth
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ingrese el código único"
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          Agregar Indicio
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="descripcion"
              label="Descripción del Objeto"
              value={indicioActual.descripcion}
              onChange={handleChangeIndicio}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              name="color"
              label="Color"
              value={indicioActual.color}
              onChange={handleChangeIndicio}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              name="tamano"
              label="Tamaño"
              value={indicioActual.tamano}
              onChange={handleChangeIndicio}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              name="peso"
              label="Peso"
              value={indicioActual.peso}
              onChange={handleChangeIndicio}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 6 }}>
            <TextField
              fullWidth
              name="ubicacion"
              label="Ubicación Física"
              value={indicioActual.ubicacion}
              onChange={handleChangeIndicio}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} display="flex" alignItems="center">
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              fullWidth
              onClick={handleAddIndicio}
              sx={{ height: "56px", fontWeight: "bold" }}
            >
              Agregar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} sx={{ mb: 3 }} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Color</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ubicación</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Acción
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listaIndicios.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{ py: 3, color: "text.secondary" }}
                >
                  Agregue indicios usando el formulario de arriba
                </TableCell>
              </TableRow>
            ) : (
              listaIndicios.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.descripcion}</TableCell>
                  <TableCell>{row.color}</TableCell>
                  <TableCell>{row.ubicacion}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => handleRemove(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        size="large"
        startIcon={<SaveIcon />}
        onClick={handleSaveAll}
        disabled={loading}
        sx={{ float: "right", mb: 4, px: 4, py: 1.5, fontWeight: "bold" }}
      >
        {loading ? "Guardando..." : "Finalizar y Guardar Expediente"}
      </Button>
    </Box>
  );
}
