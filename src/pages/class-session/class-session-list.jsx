import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// third-party
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

// project-import
//import useAuth from '../../hooks/useAuth';
import ScrollX from '../../components/ScrollX';
import MainCard from '../../components/MainCard';
import IconButton from '../../components/@extended/IconButton';
import ClassSessionModal from '../../sections/class-session/ClassSessionModal';
import EmptyReactTable from '../../pages/tables/react-table/empty';
import AlertClassSessionDelete from '../../sections/class-session/AlertClassSessionDelete';
import { useGetSesiones } from '../../api/sesiones';
import TrashClassSession from '../../sections/class-session/TrashClassSession';

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from '../../components/third-party/react-table';

// assets
import { Add, Magicpen, Edit, Trash } from 'iconsax-react';

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  // rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // store the ranking info
  addMeta(itemRank);

  // return if the item should be filtered in/out
  return itemRank.passed;
};

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler }) {
  const groups = ['Todo', ...new Set(data.map((item) => item.flag_cruce))];

  const countGroup = data.map((item) => item.flag_cruce);
  const counts = countGroup.reduce(
    (acc, value) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1
    }),
    {}
  );

  const [activeTab, setActiveTab] = useState(groups[0]);
  const [sorting, setSorting] = useState([{ id: 'unidad_didactica', desc: false }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: fuzzyFilter,
    debugTable: false
  });

  let headers = [];
  columns.map(
    (columns) =>
      // @ts-ignore
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === 'string' ? columns.header : '#',
        // @ts-ignore
        key: columns.accessorKey
      })
  );

  useEffect(() => {
    setColumnFilters(activeTab === 'Todo' ? [] : [{ id: 'flag_cruce', value: activeTab }]);
  }, [activeTab]);

  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          /* enviar datos necesarios si aplica */
        })
      });

      if (!response.ok) {
        throw new Error('Error al generar el horario');
      }

      const result = await response.json();
      console.log('Horario generado:', result);

      // Manejar los datos generados si es necesario
      // Por ejemplo, actualizar la tabla con los nuevos datos
    } catch (error) {
      console.error('Error:', error);

      // Pausa de 5 minutos antes de mostrar el mensaje de alerta
      await new Promise((resolve) => setTimeout(resolve, 150000)); // 300,000 ms = 5 minutos

      alert('No se pudo generar el horario o el tiempo se excedió. Inténtalo nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MainCard content={false}>
      <Box sx={{ p: 2.5, pb: 0, width: '100%' }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {groups.map((flag_cruce, index) => (
            <Tab
              key={index}
              label={flag_cruce === true ? 'Cruce' : flag_cruce === false ? 'Sin cruce' : 'Todo'}
              value={flag_cruce}
              icon={
                <Chip
                  label={flag_cruce === 'Todo' ? data.length : flag_cruce === true ? counts.true : counts.false}
                  color={flag_cruce === 'Todo' ? 'primary' : flag_cruce === true ? 'error' : 'success'}
                  variant="light"
                  size="small"
                />
              }
              iconPosition="end"
            />
          ))}
        </Tabs>
      </Box>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Buscar en ${data.length} registros...`}
        />

        <Stack direction="row" alignItems="center" spacing={2}>
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
            Manual
          </Button>
          <Button variant="contained" startIcon={<Magicpen />} onClick={handleGenerateSchedule} disabled={isGenerating} size="large">
            Automático
          </Button>
          <CSVExport
            {...{ data: table.getSelectedRowModel().flatRows.map((row) => row.original), headers, filename: 'classSessions-list.csv' }}
          />
          {Object.keys(rowSelection).length != 0 ? (
            <TrashClassSession {...{ data: table.getSelectedRowModel().flatRows.map((row) => row.original) }} />
          ) : (
            <></>
          )}
        </Stack>
      </Stack>
      <ScrollX>
        <Stack>
          <RowSelection selected={Object.keys(rowSelection).length} />
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                        Object.assign(header.column.columnDef.meta, {
                          className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                        });
                      }

                      return (
                        <TableCell
                          key={header.id}
                          {...header.column.columnDef.meta}
                          onClick={header.column.getToggleSortingHandler()}
                          {...(header.column.getCanSort() &&
                            header.column.columnDef.meta === undefined && {
                              className: 'cursor-pointer prevent-select'
                            })}
                        >
                          {header.isPlaceholder ? null : (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                              {header.column.getCanSort() && <HeaderSort column={header.column} />}
                            </Stack>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <TablePagination
                {...{
                  setPageSize: table.setPageSize,
                  setPageIndex: table.setPageIndex,
                  getState: table.getState,
                  getPageCount: table.getPageCount,
                  initialPageSize: 10
                }}
              />
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| INVOICE - LIST ||============================== //

export default function ClassSessionList() {
  //const { user } = useAuth();

  //const { scheduleClassLoading: loading, scheduleClass: list } = scheduleClassList;
  const { scheduleClassLoading: loading, scheduleClass: list } = useGetSesiones();

  const [open, setOpen] = useState(false);

  const [classSessionModal, setClassSessionModal] = useState(false);
  const [selectedClassSession, setSelectedClassSession] = useState(null);
  const [classSessionDeleteId, setClassSessionDeleteId] = useState('');

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(
    () => [
      {
        id: 'Row Selection',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      {
        header: 'Id',
        accessorKey: 'sesion_academica_id',
        meta: { className: 'cell-center' }
      },
      {
        header: 'Sede',
        accessorKey: 'sede'
      },
      {
        header: 'Periodo',
        accessorKey: 'periodo_academico'
      },
      {
        header: 'Unidad Didactica',
        accessorKey: 'unidad_didactica'
      },
      {
        header: 'Sección',
        accessorKey: 'seccion'
      },
      {
        header: 'Semestre',
        accessorKey: 'semestre'
      },
      {
        header: 'Programa Estudios',
        accessorKey: 'programa'
      },
      {
        header: 'Docente',
        accessorKey: 'profesor_principal'
      },
      {
        header: 'Aula / Horario',
        accessorKey: 'horario',
        cell: ({ row }) => {
          const horarios = row.original.horario;
          return (
            <Stack spacing={0.5}>
              {horarios.map((item, index) => (
                <Typography key={index} color="text.secondary">
                  {item.aula} / {item.dia}: {item.hora_inicio} - {item.hora_fin}
                </Typography>
              ))}
            </Stack>
          );
        }
      },

      {
        header: 'Cruce',
        accessorKey: 'flag_cruce',
        cell: (cell) => {
          switch (cell.getValue()) {
            case true:
              return <Chip color="error" label="Cruce" size="small" variant="light" />;
            case false:
              return <Chip color="success" label="Sin cruce" size="small" variant="light" />;
            default:
              return <Chip color="info" label="Sin Dato" size="small" variant="light" />;
          }
        }
      },
      {
        header: 'Acciones',
        meta: { className: 'cell-center' },
        disableSortBy: true,
        cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="Editar">
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedClassSession(row.original);
                    setClassSessionModal(true);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                    setClassSessionDeleteId(Number(row.original.sesion_academica_id));
                  }}
                >
                  <Trash />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ], // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Grid container direction={matchDownSM ? 'column' : 'row'} spacing={2} sx={{ pb: 2 }}>
        <Grid item xs={12}>
          {loading ? (
            <EmptyReactTable />
          ) : (
            <ReactTable
              {...{
                data: list,
                columns,
                modalToggler: () => {
                  setClassSessionModal(true);
                  setSelectedClassSession(null);
                }
              }}
            />
          )}
          <AlertClassSessionDelete
            id={Number(classSessionDeleteId)}
            classSessionId={classSessionDeleteId.toString()}
            open={open}
            handleClose={handleClose}
          />
          <ClassSessionModal open={classSessionModal} modalToggler={setClassSessionModal} classSession={selectedClassSession} />
        </Grid>
      </Grid>
    </>
  );
}

ReactTable.propTypes = { data: PropTypes.array, columns: PropTypes.array };
