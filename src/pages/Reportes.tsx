import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AssessmentIcon from "@mui/icons-material/Assessment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axios";

interface ReporteRow {
  Codigo: string;
  FechaRegistro: string;
  Estado: string;
  TecnicoResponsable: string;
  CantidadIndicios: number;
}
interface GraficaItem {
  name: string;
  Cantidad: number;
}

export default function Reportes() {
  const hoy = new Date().toISOString().split("T")[0];
  const haceUnMes = new Date();
  haceUnMes.setMonth(haceUnMes.getMonth() - 1);
  const fechaInicialDefecto = haceUnMes.toISOString().split("T")[0];
  const [fechaInicio, setFechaInicio] = useState(fechaInicialDefecto);
  const [fechaFin, setFechaFin] = useState(hoy);
  const [idEstado, setIdEstado] = useState<string>("");
  const [data, setData] = useState<ReporteRow[]>([]);

  const handleBuscar = async () => {
    try {
      const params: {
        fechaInicio: string;
        fechaFin: string;
        idEstado?: string;
      } = {
        fechaInicio,
        fechaFin,
      };

      if (idEstado) params.idEstado = idEstado;

      const response = await api.get("/expedientes/reporte-general", {
        params,
      });
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error cargando reporte", error);
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) =>
    setIdEstado(event.target.value as string);

  const datosGrafica = data.reduce<GraficaItem[]>((acc, curr) => {
    const existente = acc.find((item) => item.name === curr.Estado);
    if (existente) existente.Cantidad += 1;
    else acc.push({ name: curr.Estado, Cantidad: 1 });
    return acc;
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, borderLeft: "5px solid #9c27b0", pl: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Reportes y Métricas
        </Typography>
        <Typography color="text.secondary">
          Análisis de productividad y estados
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              type="date"
              label="Fecha Inicio"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              type="date"
              label="Fecha Fin"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={idEstado}
                label="Estado"
                onChange={handleSelectChange}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="1">Registrado</MenuItem>
                <MenuItem value="2">En Revisión</MenuItem>
                <MenuItem value="3">Aprobado</MenuItem>
                <MenuItem value="4">Rechazado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<SearchIcon />}
              onClick={handleBuscar}
              sx={{ height: "56px" }}
            >
              Generar Informe
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {data.length > 0 ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper elevation={3} sx={{ p: 3, height: 450, borderRadius: 2 }}>
              <Typography
                variant="h6"
                align="center"
                gutterBottom
                fontWeight="bold"
              >
                Volumen por Estado
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={datosGrafica}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="Cantidad"
                    fill="#9c27b0"
                    radius={[5, 5, 0, 0]}
                    name="Expedientes"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper
              elevation={3}
              sx={{
                height: 450,
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                sx={{ p: 2, bgcolor: "#f5f5f5" }}
                fontWeight="bold"
              >
                Detalle de Registros
              </Typography>
              <TableContainer sx={{ flexGrow: 1 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>CÓDIGO</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>FECHA</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>ESTADO</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>TÉCNICO</TableCell>
                      <TableCell
                        sx={{ fontWeight: "bold", textAlign: "center" }}
                      >
                        INDICIOS
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{row.Codigo}</TableCell>
                        <TableCell>
                          {new Date(row.FechaRegistro).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{row.Estado}</TableCell>
                        <TableCell>{row.TecnicoResponsable}</TableCell>
                        <TableCell align="center">
                          {row.CantidadIndicios}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height={300}
          sx={{ opacity: 0.6 }}
        >
          <AssessmentIcon
            sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary">
            No hay datos para mostrar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ajusta los filtros de fecha y presiona "Generar Informe"
          </Typography>
        </Box>
      )}
    </Container>
  );
}
