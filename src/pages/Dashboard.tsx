import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Container,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import api from "../api/axios";
import type { Expediente } from "../interfaces/Expediente";

export default function Dashboard() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const fetchExpedientes = async (busqueda: string = "") => {
    setLoading(true);
    try {
      const params = busqueda ? { busqueda } : {};
      const response = await api.get("/expedientes", { params });

      if (response.data.success) {
        setRows(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Error al cargar los expedientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpedientes();
  }, []);

  const handleSearch = () => {
    fetchExpedientes(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    fetchExpedientes("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const columns: GridColDef[] = [
    { field: "Codigo", headerName: "Código", flex: 1, minWidth: 150 },
    {
      field: "FechaRegistro",
      headerName: "Fecha Registro",
      flex: 1,
      minWidth: 200,
      valueFormatter: (params) => new Date(params as string).toLocaleString(),
    },
    {
      field: "Tecnico",
      headerName: "Técnico Responsable",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "TotalIndicios",
      headerName: "Indicios",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Estado",
      headerName: "Estado",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => {
        let color:
          | "default"
          | "primary"
          | "secondary"
          | "error"
          | "success"
          | "warning"
          | "info" = "default";
        switch (params.row.IdEstado) {
          case 1:
            color = "info";
            break;
          case 2:
            color = "warning";
            break;
          case 3:
            color = "success";
            break;
          case 4:
            color = "error";
            break;
          default:
            color = "default";
        }
        return (
          <Chip
            label={params.value as string}
            color={color}
            variant="filled"
            size="small"
            sx={{ fontWeight: "bold", minWidth: "100px" }}
          />
        );
      },
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ borderLeft: "5px solid #1976d2", pl: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            Tablero de Control
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestión centralizada de expedientes
          </Typography>
        </Box>

        <Paper
          elevation={2}
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 300,
          }}
        >
          <TextField
            sx={{ ml: 1, flex: 1 }}
            placeholder="Buscar por Código..."
            variant="standard"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  {searchTerm && (
                    <IconButton size="small" onClick={handleClear}>
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton
                    type="button"
                    aria-label="search"
                    onClick={handleSearch}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={3}
        sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={400}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.IdExpediente}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              border: 0,
              "& .MuiDataGrid-cell:hover": { color: "primary.main" },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
              },
              cursor: "pointer",
            }}
            onRowClick={(params) =>
              navigate(`/expedientes/${params.row.IdExpediente}`)
            }
          />
        )}
      </Paper>
    </Container>
  );
}
