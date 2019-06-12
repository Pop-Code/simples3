import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { AccountCircle, CloudQueue, List } from '@material-ui/icons';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { SearchForm } from './form';
import { AppBar, Toolbar, IconButton, Typography, createStyles, withStyles, MenuItem, Menu } from '@material-ui/core';

const styles = (theme: any) =>
    createStyles({
        appBar: {
            ['-webkit-app-region']: 'drag'
        },
        grow: {
            flexGrow: 1
        },
        menuButton: {
            marginLeft: -12,
            marginRight: 0
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            ['&:hover']: {
                backgroundColor: fade(theme.palette.common.white, 0.25)
            },
            transition: theme.transitions.create('background-color', {
                delay: 200
            }),
            marginRight: theme.spacing(2),
            marginLeft: 0
        },
        searchIcon: {
            width: theme.spacing(9),
            [theme.breakpoints.down('xs')]: {
                width: theme.spacing(5)
            },
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        inputRoot: {
            color: 'inherit',
            width: '100%',
            transition: theme.transitions.create('width', { delay: 100 }),
            [theme.breakpoints.down('xs')]: {
                width: 150
            }
        },
        inputInput: {
            width: '100%',
            paddingTop: theme.spacing(1),
            paddingRight: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(9),
            [theme.breakpoints.down('xs')]: {
                paddingLeft: theme.spacing(5)
            }
        }
    });

interface HeaderProps {
    classes: any;
    auth: any;
}

class Header extends React.Component<HeaderProps> {
    public state: any = { anchorEl: null };

    static propTypes = {
        classes: PropTypes.object.isRequired
    } as any;

    handleMenu(event: any) {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleClose() {
        this.setState({ anchorEl: null });
    }

    constructor(props: any) {
        super(props);
        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidUpdate() {
        if (Boolean(this.state.anchorEl) && !document.body.contains(this.state.anchorEl)) {
            this.handleClose();
        }
    }

    render() {
        const { classes, auth } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        if (!auth) {
            return null;
        }

        return (
            <AppBar position="fixed" color="primary" className={classes.appBar}>
                <Toolbar>
                    <IconButton className={classes.menuButton} disableRipple={true} color="inherit">
                        <CloudQueue />
                    </IconButton>
                    <Typography variant="h6" color="inherit">
                        SimpleS3
                    </Typography>
                    <div className={classes.grow} />
                    {auth && (
                        <>
                            <div>
                                <SearchForm classes={classes} lable="Search..." />
                            </div>

                            <div>
                                <IconButton
                                    color="inherit"
                                    component={React.forwardRef((props: any, ref) => (
                                        <NavLink to="/list" {...props} innerRef={ref} />
                                    ))}
                                >
                                    <List />
                                </IconButton>
                            </div>
                            <div>
                                <IconButton
                                    aria-owns={open ? 'menu-appbar' : undefined}
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                    open={open}
                                    onClose={this.handleClose}
                                >
                                    <MenuItem divider onClick={this.handleClose} selected={false}>
                                        {auth.Arn.split('/')[1]}
                                    </MenuItem>
                                    <NavLink exact to="/login" style={{ textDecoration: 'none' }}>
                                        <MenuItem>Logout</MenuItem>
                                    </NavLink>
                                </Menu>
                            </div>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        );
    }
}

export default withStyles(styles)(Header);
