import { useState, type ReactNode } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';

const LARGURA_MENU = 240;

const ITENS_MENU = [
  { texto: 'Dashboard', icone: <DashboardIcon /> },
  { texto: 'Veículos', icone: <DirectionsCarIcon />, ativo: true },
  { texto: 'Agendamentos', icone: <EventIcon /> },
  { texto: 'Clientes', icone: <PeopleIcon /> },
  { texto: 'Serviços', icone: <LocalCarWashIcon /> },
  { texto: 'Configurações', icone: <SettingsIcon /> },
];

interface LayoutProps {
  children: ReactNode;
  notificacoes: number;
  onMenuIlustrativo: (item: string) => void;
}

export default function Layout({ children, notificacoes, onMenuIlustrativo }: LayoutProps) {
  const [menuAberto, setMenuAberto] = useState(false);

  const conteudoMenu = (
    <Box>
      <Toolbar sx={{ gap: 1.5 }}>
        <Avatar src="/logo.png" alt="LW" sx={{ width: 40, height: 40, boxShadow: '0 0 10px #00f5ff' }} />
        <Typography variant="h6" fontWeight={700} className="titulo-gradiente">
          Norteador
        </Typography>
      </Toolbar>
      <List sx={{ px: 1 }}>
        {ITENS_MENU.map((item) => (
          <ListItemButton
            key={item.texto}
            selected={item.ativo}
            onClick={() => {
              setMenuAberto(false);
              if (!item.ativo) onMenuIlustrativo(item.texto);
            }}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ color: item.ativo ? 'primary.main' : 'text.secondary' }}>{item.icone}</ListItemIcon>
            <ListItemText primary={item.texto} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${LARGURA_MENU}px)` },
          ml: { md: `${LARGURA_MENU}px` },
          bgcolor: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'primary.main',
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMenuAberto(true)} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Veículos
          </Typography>
          <Tooltip title="Notificações">
            <IconButton color="inherit" onClick={() => onMenuIlustrativo('Notificações')}>
              <Badge badgeContent={notificacoes} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Sabrina Miyamoto">
            <Avatar sx={{ ml: 1.5, width: 34, height: 34, bgcolor: 'secondary.main' }}>S</Avatar>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: LARGURA_MENU }, flexShrink: { md: 0 } }}>
        {/* Celular: menu que abre por cima */}
        <Drawer
          variant="temporary"
          open={menuAberto}
          onClose={() => setMenuAberto(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: LARGURA_MENU } }}
        >
          {conteudoMenu}
        </Drawer>
        {/* Desktop: menu fixo */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: LARGURA_MENU, bgcolor: '#0d0f1c', borderRight: '1px solid rgba(0,245,255,0.25)' },
          }}
        >
          {conteudoMenu}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${LARGURA_MENU}px)` }, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
